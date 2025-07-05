interface CodeCardProps {
  title: string;
  description: string;
}

export default function CodeCard({ title, description }: CodeCardProps) {
  return (
    <div className="code-card p-6">
      <h3 className="font-bold text-lime-300 mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}