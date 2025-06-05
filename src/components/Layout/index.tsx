import clsx from 'clsx';

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Layout({ children, className }: LayoutProps) {
  return (
    <div className={clsx('w-full h-screen')}>
      <div className={clsx('max-w-[1600px] h-full m-auto', className)}>
        {children}
      </div>
    </div>
  );
}
