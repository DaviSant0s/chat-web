import clsx from 'clsx';

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Layout({ children, className }: LayoutProps) {
  return (
    <div className={clsx('w-full h-screen')}>
      <div className={clsx('max-w-[1500px] h-full m-auto px-5', className)}>
        {children}
      </div>
    </div>
  );
}
