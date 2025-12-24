import './StarBorder.css';

const StarBorder = ({
  as: Component = 'button',
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  variant = 'primary', // 'primary' = 绿色背景, 'secondary' = 黑色背景
  children,
  ...rest
}) => {
  const isPrimary = variant === 'primary';
  
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px 0`,
        background: isPrimary ? '#00C05C' : '#0a0a0a',
        border: isPrimary ? 'none' : '1px solid rgba(255,255,255,0.2)',
        ...rest.style
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color} 0%, ${color} 20%, transparent 60%)`,
          animationDuration: speed
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color} 0%, ${color} 20%, transparent 60%)`,
          animationDuration: speed
        }}
      ></div>
      <div 
        className="inner-content"
        style={{
          background: isPrimary ? '#00C05C' : '#0a0a0a',
          color: isPrimary ? 'black' : 'white',
        }}
      >
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
