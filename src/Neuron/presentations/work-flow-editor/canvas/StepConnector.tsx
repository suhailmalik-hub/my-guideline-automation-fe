export const StepConnector = () => {
  return (
    <div className='flex flex-col items-center py-0'>
      <svg
        width='2'
        height='32'
        className='text-gray-300'
      >
        <line
          x1='1'
          y1='0'
          x2='1'
          y2='24'
          stroke='currentColor'
          strokeWidth='2'
        />
        <polygon
          points='1,32 -3,24 5,24'
          fill='currentColor'
        />
      </svg>
    </div>
  );
};
