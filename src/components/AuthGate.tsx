import React from 'react';
import { 
  Lock, 
  Sparkles, 
  LogIn, 
  UserPlus, 
  Bot, 
  Code2, 
  History, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { authService } from '../services/auth';

interface AuthGateProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  targetViewName?: string;
}

export const AuthGate: React.FC<AuthGateProps> = ({
  onOpenLogin,
  onOpenRegister,
  targetViewName = 'IMCH Chat & Developer'
}) => {
  const handleQuickDemoLogin = () => {
    const res = authService.loginDemoUser();
    if (!res.success) {
      onOpenLogin();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-b from-neutral-50 via-white to-neutral-100 dark:from-[#050507] dark:via-[#09090d] dark:to-[#050507] text-neutral-900 dark:text-neutral-100 overflow-y-auto select-none">
      <div className="max-w-2xl w-full mx-auto my-auto flex flex-col items-center text-center">
        {/* Security / IMCH Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span className="uppercase tracking-wider">Acesso Protegido • Sessão Obrigatória</span>
        </div>

        {/* Brand Icon & Heading */}
        <div className="relative mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/10">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white/95" />
          </div>
          <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-amber-500 text-black shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
          Inicie sessão para aceder ao <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">IMCH Studio</span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-lg mb-8 leading-relaxed">
          Para utilizar o <strong className="text-neutral-900 dark:text-neutral-200">IMCH Chat</strong>, aceder ao <strong className="text-neutral-900 dark:text-neutral-200">IMCH AI Developer</strong> e consultar o seu <strong className="text-neutral-900 dark:text-neutral-200">histórico de conversas e projetos</strong>, deve iniciar sessão na sua conta.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mb-6">
          <button
            type="button"
            onClick={onOpenLogin}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md hover:shadow-blue-600/20 cursor-pointer active:scale-98"
          >
            <LogIn className="w-4 h-4" />
            <span>Iniciar Sessão</span>
          </button>

          <button
            type="button"
            onClick={onOpenRegister}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 font-semibold text-sm transition-all border border-neutral-300 dark:border-neutral-700 cursor-pointer active:scale-98"
          >
            <UserPlus className="w-4 h-4" />
            <span>Criar Conta</span>
          </button>
        </div>

        {/* Quick User Selection for Multi-User Private Workspaces */}
        <div className="w-full max-w-lg mb-8 p-4 rounded-2xl bg-neutral-100 dark:bg-[#121216] border border-neutral-300 dark:border-neutral-800 text-xs text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Contas Prontas para Testar Espaços Privados Isolados:</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                authService.login('antonio@dev.imch.ao', '123456');
              }}
              className="p-2.5 rounded-xl bg-white dark:bg-[#181820] border border-neutral-300 dark:border-neutral-700/80 hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 text-left transition-all cursor-pointer group"
            >
              <div className="font-bold text-neutral-900 dark:text-white text-xs truncate group-hover:text-blue-500">
                António
              </div>
              <div className="text-[10px] text-neutral-500 truncate font-mono">
                antonio@dev.imch.ao
              </div>
              <span className="text-[9px] font-semibold text-blue-500 mt-1 block">
                🔒 Área do António →
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                authService.login('sofialane5720@gmail.com', '123456');
              }}
              className="p-2.5 rounded-xl bg-white dark:bg-[#181820] border border-neutral-300 dark:border-neutral-700/80 hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 text-left transition-all cursor-pointer group"
            >
              <div className="font-bold text-neutral-900 dark:text-white text-xs truncate group-hover:text-emerald-500">
                Sofia Lane
              </div>
              <div className="text-[10px] text-neutral-500 truncate font-mono">
                sofialane...
              </div>
              <span className="text-[9px] font-semibold text-emerald-500 mt-1 block">
                🔒 Área da Sofia →
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                authService.login('carlos@imch.pt', '123456');
              }}
              className="p-2.5 rounded-xl bg-white dark:bg-[#181820] border border-neutral-300 dark:border-neutral-700/80 hover:border-amber-500 hover:bg-amber-50/40 dark:hover:bg-amber-950/30 text-left transition-all cursor-pointer group"
            >
              <div className="font-bold text-neutral-900 dark:text-white text-xs truncate group-hover:text-amber-500 flex items-center justify-between">
                <span>Carlos Tech</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-500 px-1 rounded">PRO</span>
              </div>
              <div className="text-[10px] text-neutral-500 truncate font-mono">
                carlos@imch.pt
              </div>
              <span className="text-[9px] font-semibold text-amber-500 mt-1 block">
                ⭐ Área PRO →
              </span>
            </button>
          </div>

          <p className="text-[10px] text-neutral-500 leading-tight">
            Cada conta possui a sua própria área reservada íntima: projetos privados, chats e ficheiros não se misturam. Apenas são partilhados se convidar outro utilizador explicitamente.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left">
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#121216] border border-neutral-200 dark:border-neutral-800/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5">
              <History className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-neutral-900 dark:text-neutral-100 mb-1">
              Histórico Persistente
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
              Reveja, restaure e continue conversas e projetos criados anteriormente a qualquer momento.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#121216] border border-neutral-200 dark:border-neutral-800/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2.5">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-neutral-900 dark:text-neutral-100 mb-1">
              Ambiente de Programação
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
              Gere projetos web com múltiplos ficheiros (HTML, CSS, JS) e pré-visualização em tempo real.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#121216] border border-neutral-200 dark:border-neutral-800/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-neutral-900 dark:text-neutral-100 mb-1">
              3 Créditos de Boas-Vindas
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
              Novas contas recebem créditos gratuitos para começar a testar a geração de código imediatamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
