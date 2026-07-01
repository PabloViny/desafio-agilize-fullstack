# Minha Solução — Banco

## Stack
- **Backend:** Node.js 18+ com TypeScript e Express
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS

## Pré-requisitos / dependências
- Node.js 18 ou superior instalado — [nodejs.org](https://nodejs.org)
- npm (incluso com o Node.js)

## Como executar

### Backend (API)
```bash
cd backend
npm install
npm run dev  →  API em http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev  →  http://localhost:5173
```

## Exemplo de uso
```
1. Acesse http://localhost:5173 no navegador.
2. Clique em uma conta para selecioná-la.
3. Informe um valor no campo de saque e clique em "Realizar Saque".
   → A API retorna o novo saldo e uma mensagem de sucesso.
   → Se o limite for ultrapassado, a API retorna a mensagem de erro da regra de negócio.
4. Na aba "Transferência", selecione a conta de destino, informe o valor e confirme.
```

## Observações (opcional)
- Base de dados em memória — os dados são reiniciados ao reiniciar o backend.
- Conta Corrente: tarifa fixa de R$ 1,00 por operação, cheque especial até R$ -500,00.
- Conta Poupança: sem tarifa, nunca pode ficar negativa.
- Transferência implementada como diferencial, com tarifa descontada da conta corrente de origem.