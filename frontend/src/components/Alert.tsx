interface Props {
  type: "success" | "error";
  message: string;
}

// Componente de feedback visual para sucesso e erro.
export function Alert({ type, message }: Props) {
  const styles = {
    success: "bg-green-50 border-green-400 text-green-800",
    error: "bg-red-50 border-red-400 text-red-800",
  };

  return (
    <div className={`border-l-4 rounded p-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  );
}
