import clsx from "clsx";

interface ChatBubble {
  side: 'left' | 'right';
  msg: string;
}

export default function ChatBubble({side, msg}: ChatBubble) {

  const leftStyle = 'bg-white text-black rounded-bl-none';
  const rightStyle = 'bg-green-500 text-white rounded-br-none';

  const style = side === 'left' ? leftStyle : rightStyle;


  return (
    <div className="w-full">
      <div className={`flex justify-${side === 'left' ? 'start' : 'end'} mb-2`}>
        <div
          className={clsx(
            'max-w-xs',
            'p-2',
            'rounded-lg',
            'shadow',
            'break-words',
            style
          )}
        >
          {msg}
        </div>
      </div>
    </div>
  );
}
