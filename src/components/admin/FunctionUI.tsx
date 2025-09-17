// src/components/admin/FunctionUI.tsx

"use client";

import { useAccount } from 'wagmi';
import { useWriteContract, usePublicClient } from 'wagmi';
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
  const [isLoading, setIsLoading] = useState(false);

  const publicClient = usePublicClient();
  const { writeContract, isPending: isWriting } = useWriteContract();

  const handleInputChange = (name: string, value: string) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const validateAndPrepareArgs = () => {
    const finalArgs: any[] = [];
    for (const inputDef of func.inputs) {
        const name = inputDef.name || `arg${func.inputs.indexOf(inputDef)}`;
        const value = inputs[name];

        if (value === undefined || value === '') {
            toast.error(`Lütfen '${name}' alanını doldurun.`);
            return null;
        }

        // Parametre tipine ve adına göre özel dönüşüm
        switch (inputDef.type) {
            case 'address':
                if (!isAddress(value)) {
                    toast.error(`Geçersiz Adres: '${name}' alanı için geçerli bir adres girin.`);
                    return null;
                }
                finalArgs.push(value);
                break;
            
            case 'bool':
                if (value.toLowerCase() !== 'true' && value.toLowerCase() !== 'false') {
                    toast.error(`Geçersiz Değer: '${name}' alanı için 'true' veya 'false' girin.`);
                    return null;
                }
                finalArgs.push(value.toLowerCase() === 'true');
                break;

            case 'uint256':
                try {
                    // 'cost', 'price' veya 'value' içeren alanlar için ondalıklı (ether) dönüşüm yap
                    if (name.toLowerCase().includes('cost') || name.toLowerCase().includes('price') || name.toLowerCase().includes('value')) {
                        finalArgs.push(parseEther(value));
                    } else {
                    // 'power', 'stamina' gibi tam sayılar için BigInt kullan
                        finalArgs.push(BigInt(value));
                    }
                } catch {
                    toast.error(`Geçersiz Sayı: '${name}' alanı için geçerli bir sayısal değer girin.`);
                    return null;
                }
                break;

            default:
                finalArgs.push(value);
                break;
        }
    }
    return finalArgs;
  };

  const executeRead = async () => {
    const preparedArgs = validateAndPrepareArgs();
    if (preparedArgs === null && func.inputs.length > 0) return;

    if (!publicClient) {
      toast.error('Blockchain client is not ready yet.');
      return;
    }

    setIsLoading(true);
    toast.info(`"${func.name}" fonksiyonu okunuyor...`);
    try {
        const data = await publicClient.readContract({
            ...contractConfig,
            functionName: func.name,
            args: preparedArgs || [],
        });
        
        const displayData = JSON.stringify(data, (key, value) => 
            typeof value === 'bigint' ? value.toString() : value, 2);
            
        setResult(displayData);
        toast.success(`"${func.name}" başarıyla okundu!`);
    } catch (err: any) {
        setResult(`Hata: ${err.message}`);
        toast.error(`Okuma hatası: ${err.shortMessage || err.message}`);
    } finally {
        setIsLoading(false);
    }
  };
  
  const executeWrite = () => {
    const preparedArgs = validateAndPrepareArgs();
    if (preparedArgs === null) return;

    const valueToSend = func.stateMutability === 'payable' ? parseEther(inputs.value || '0') : undefined;

    toast.info(`"${func.name}" işlemi için cüzdan onayı bekleniyor...`);
    writeContract({
        ...contractConfig,
        functionName: func.name,
        args: preparedArgs as any,
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
      <Button onClick={type === 'read' ? executeRead : executeWrite} disabled={isLoading || isWriting}>
        {isLoading ? 'Okunuyor...' : isWriting ? 'Gönderiliyor...' : 'Çalıştır'}
      </Button>
      {result && (
        <pre className="mt-4 p-2 bg-muted rounded-md text-sm whitespace-pre-wrap break-all">
          <code className="text-muted-foreground">{result}</code>
        </pre>
      )}
    </div>
  );
}

