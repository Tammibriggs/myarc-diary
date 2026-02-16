'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Unlock, ShieldCheck } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export function PrivacyGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const { colors } = useTheme();

    // We only care if the user has a pin set in the DB
    // @ts-ignore
    const hasPrivacyPin = session?.user?.privacyPinSet;

    const [isLocked, setIsLocked] = useState(false);
    const [pinInput, setPinInput] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (status === 'authenticated' && hasPrivacyPin) {
            // Check session storage to see if already unlocked during this browser session
            const unlocked = sessionStorage.getItem('myarc-privacy-unlocked');
            if (unlocked !== 'true') {
                setIsLocked(true);
            }
        }
    }, [status, hasPrivacyPin]);

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/user/pin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin: pinInput }),
            });

            if (res.ok) {
                setIsLocked(false);
                sessionStorage.setItem('myarc-privacy-unlocked', 'true');
            } else {
                setError('Incorrect PIN');
                setPinInput('');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLocked) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
                <div className="w-full max-w-md p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div
                        className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl relative"
                        style={{
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                        }}
                    >
                        <Lock className="w-10 h-10 text-white" />

                        {/* Pulse effect */}
                        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Privacy Lock</h2>
                        <p className="text-muted-foreground">Enter your PIN to access your journal.</p>
                    </div>

                    <form onSubmit={handleUnlock} className="space-y-4 max-w-xs mx-auto">
                        <Input
                            type="password"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value)}
                            className="text-center text-3xl tracking-[12px] font-mono h-16 rounded-xl border-t-0 border-x-0 border-b-2 focus:ring-0 focus:border-primary bg-transparent shadow-none placeholder:tracking-normal"
                            placeholder="••••"
                            autoFocus
                        />

                        {error && <p className="text-red-500 text-sm font-medium animate-shake">{error}</p>}

                        <Button
                            type="submit"
                            disabled={isLoading || pinInput.length < 4}
                            className="w-full h-12 text-lg font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                            style={{
                                background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                                color: colors.logoBg
                            }}
                        >
                            {isLoading ? 'Unlocking...' : 'Unlock Journal'}
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
