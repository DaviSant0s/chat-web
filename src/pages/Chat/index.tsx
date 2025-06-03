import InputSendMessage from '@/components/InputSendMessage';
import Layout from '@/components/Layout';
import clsx from 'clsx';

export default function Chat() {
  return (
    <Layout>
      <div
        className={clsx(
          'h-full',
          'flex',
          'flex-row',
          'justify-baseline',
          'border-l-1',
          'border-r-1',
          'border-slate-300',
          'shadow-gray-400',
          'shadow-2xl'
        )}
      >
        <div className="w-2/3 bg-slate-600">
          <div className="h-14 flex items-center pl-2">
            <h1 className="font-extrabold text-white text-2xl">Grupos</h1>
          </div>
          <div></div>
        </div>
        <div className="w-full h-full flex flex-col">
          <div className="h-16 flex items-center pl-2 bg-zinc-500 border-b-1 border-gray-300">
            <h1 className="font-extrabold text-white text-2xl">NodeJS</h1>
          </div>

          <div className="flex flex-col h-full">
            <div className="w-full h-full flex-col p-2">
              <div className="w-full">
                <div className="flex justify-start mb-2">
                  <div
                    className={clsx(
                      'max-w-2xs',
                      'bg-gray-200',
                      'text-black',
                      'p-2',
                      'rounded-lg',
                      'rounded-bl-none',
                      'shadow',
                      'break-words'
                    )}
                  >
                    Oii tudo bem??
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-end mb-2">
                  <div
                    className={clsx(
                      'max-w-xs',
                      'bg-green-500',
                      'text-white',
                      'p-2',
                      'rounded-lg',
                      'rounded-br-none',
                      'shadow',
                      'break-words'
                    )}
                  >
                    Tudo sim! E você?
                  </div>
                </div>
              </div>
            </div>
            <div className="max-h-fit pl-2 pr-2">
              <InputSendMessage />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
