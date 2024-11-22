interface TitleProps {
    title: string;
}

export default function PageTitle({ title }: TitleProps) {
    return (
      <div className="pt-2 pl-4">
        <h1 className="text-2xl font-bold text-textPrimary">{title}</h1>
      </div>
    );
  }
  