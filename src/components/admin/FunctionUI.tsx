"use client";

import { useAccount } from 'wagmi';
import { useReadContract, useWriteContract } from 'wagmi';
import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { isAddress, parseEther } from 'viem';

interface FunctionUIProps {
    func: any;
    contractConfig: {
        address: `0x${string}`;
        abi: any;
    };
    type: 'read' | 'write';
}

export function FunctionUI({ func, contractConfig, type }: FunctionUIProps) {
  const { address: connectedAddress } = useAccount();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>('');

  const { refetch, isLoading: isReading } = useReadContract({
    ...contractConfig,
    functionName: func.name,
    args: func.inputs.map((input: any) => inputs[input.name] || ''),
    query: { enabled: false }
  });

  const { writeContract, isPending: isWriting } = useWriteContract();

  const handleInputChange = (name: string, value: string) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    for (const inputDef of func.inputs) {
      if (inputDef.type === 'address') {
        const addressValue = inputs[inputDef.name];
        if (!addressValue || !isAddress(addressValue)) {
          toast.error(`Geçersiz Adres: Lütfen '${inputDef.name}' alanına geçerli bir Ethereum adresi girin.`);
          return false;
        }
      }
    }
    return true;
  };

  const executeRead = async () => {
    if (!validateInputs()) return;

    toast.info(`"${func.name}" fonksiyonu okunuyor...`);
    try {
        const { data: readData, isError, error } = await refetch();
        if (isError) throw error;
        
        const displayData = JSON.stringify(readData, (key, value) => 
            typeof value === 'bigint' ? value.toString() : value, 2);
            
        setResult(displayData);
        toast.success(`"${func.name}" başarıyla okundu!`);
    } catch (err: any) {
        setResult(`Hata: ${err.message}`);
        toast.error(`Okuma hatası: ${err.shortMessage || err.message}`);
    }
  };
  
  const executeWrite = () => {
    if (!validateInputs()) return;
    
    const args = func.inputs.map((input: any) => {
        const value = inputs[input.name];
        if (input.type.includes('uint')) {
            try {
                return value.includes('.') ? parseEther(value) : BigInt(value);
            } catch {
                toast.error(`'${input.name}' için geçersiz sayı formatı.`);
                return;
            }
        }
        return value;
    });

    if (args.includes(undefined)) return;

    const valueToSend = func.stateMutability === 'payable' ? parseEther(inputs.value || '0') : undefined;

    toast.info(`"${func.name}" işlemi için cüzdan onayı bekleniyor...`);
    writeContract({
        ...contractConfig,
        functionName: func.name,
        args: args as any,
        value: valueToSend
    }, {
        onSuccess: (hash) => toast.success(`İşlem başarıyla gönderildi! Hash: ${hash}`),
        onError: (error) => toast.error(`Hata: ${ error.message}`),
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-card shadow-sm">
      <h3 className="font-mono font-semibold text-primary">{func.name}</h3>
      <div className="my-3 space-y-2">
        {func.inputs.map((input: any, index: number) => (
          <div key={input.name || index} className="flex items-center gap-2">
            <Input
              placeholder={`${input.name || `arg${index}`} (${input.type})`}
              value={inputs[input.name || `arg${index}`] || ''}
              onChange={(e) => handleInputChange(input.name || `arg${index}`, e.target.value)}
            />
            {input.type === 'address' && (
              <Button 
                variant="outline" 
                size="sm"
                type="button"
                className="shrink-0"
                onClick={() => handleInputChange(input.name || `arg${index}`, connectedAddress || '')}
              >
                Benim Adresim
              </Button>
            )}
          </div>
        ))}
        {func.stateMutability === 'payable' && (
             <Input
                placeholder="Gönderilecek ETH Miktarı (Örn: 0.005)"
                value={inputs.value || ''}
                onChange={(e) => handleInputChange('value', e.target.value)}
            />
        )}
      </div>
      <Button onClick={type === 'read' ? executeRead : executeWrite} disabled={isReading || isWriting}>
        Çalıştır
      </Button>
      {result && (
        <pre className="mt-4 p-2 bg-muted rounded-md text-sm whitespace-pre-wrap break-all">
          <code className="text-muted-foreground">{result}</code>
        </pre>
      )}
    </div>
  );
}