'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ConstellationIconProps {
  iconType: 'link' | 'palette' | 'code' | 'rocket' | 'building' | 'flowchart' | 'monitor' | 'linechart' | 'operation';
  isHovered: boolean;
  staticColor?: string;
  hoverColor?: string;
  // 静态模式：'scattered' = 完全分散（Workflow用）, 'outline' = 形成轮廓, 'flowing' = 持续流动
  staticMode?: 'scattered' | 'outline' | 'flowing';
  // icon 位置偏移（正数向下，负数向上）
  iconOffsetY?: number;
  // icon 缩放比例（默认 1.0，0.8 表示缩小 20%）
  iconScaleMultiplier?: number;
}

interface Star {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  driftX: number;
  driftY: number;
  connectedTo: number[]; // 连接的星星索引
  // 流动模式专用
  pathProgress?: number; // 在路径上的进度 (0-1)
  pathSpeed?: number; // 流动速度
  pathIndex?: number; // 属于哪条路径
}

const ConstellationIcon: React.FC<ConstellationIconProps> = ({
  iconType,
  isHovered,
  staticColor = 'rgba(255, 255, 255, 0.4)',
  hoverColor = 'rgba(0, 192, 92, 0.8)',
  staticMode = 'scattered',
  iconOffsetY = 0,
  iconScaleMultiplier = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);
  const timeRef = useRef(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const hoverStartTimeRef = useRef(0);
  const leaveStartTimeRef = useRef(0);
  const initializedRef = useRef(false);

  // 监听容器尺寸
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 根据 iconType 生成目标点和连线关系
  const generateIconData = (width: number, height: number, iconType: string) => {
    // 上面两个卡片（rocket, building）向右平移 20px
    const iconCenterX = (iconType === 'rocket' || iconType === 'building') 
      ? width * 0.75 + 50 
      : width * 0.75 + 30;
    // 上面两个卡片（rocket, building）向下平移 20px
    // 下面四个卡片（flowchart, monitor, code, linechart）向上平移 20px
    let iconCenterY: number;
    if (iconType === 'rocket' || iconType === 'building') {
      iconCenterY = height * 0.5;
    } else if (iconType === 'flowchart' || iconType === 'monitor' || iconType === 'code' || iconType === 'linechart' || iconType === 'operation') {
      iconCenterY = height * 0.5 - 40;
    } else {
      iconCenterY = height * 0.5 - 20;
    }
    // 应用额外的 Y 偏移
    iconCenterY += iconOffsetY;
    const iconScale = Math.min(width * 0.4, height * 0.8) * 0.6 * iconScaleMultiplier;
    
    let targetPoints: { x: number; y: number }[] = [];
    let connections: number[][] = [];
    let cornerIndices: number[] = [];
    // 流动路径：每条路径是一系列点的索引
    let flowPaths: number[][] = [];

    if (iconType === 'link') {
      // 文档 icon
      cornerIndices = [0, 1, 2, 3, 4];
      targetPoints = [
        { x: iconCenterX - iconScale * 0.3, y: iconCenterY - iconScale * 0.35 }, // 0: 左上
        { x: iconCenterX - iconScale * 0.3, y: iconCenterY + iconScale * 0.35 }, // 1: 左下
        { x: iconCenterX + iconScale * 0.3, y: iconCenterY + iconScale * 0.35 }, // 2: 右下
        { x: iconCenterX + iconScale * 0.3, y: iconCenterY - iconScale * 0.1 }, // 3: 右上（折角前）
        { x: iconCenterX + iconScale * 0.1, y: iconCenterY - iconScale * 0.35 }, // 4: 折角顶部
        { x: iconCenterX + iconScale * 0.1, y: iconCenterY - iconScale * 0.1 }, // 5: 折角内部点
        { x: iconCenterX - iconScale * 0.2, y: iconCenterY - iconScale * 0.05 }, // 6: 横线1起点
        { x: iconCenterX + iconScale * 0.05, y: iconCenterY - iconScale * 0.05 }, // 7: 横线1终点
        { x: iconCenterX - iconScale * 0.2, y: iconCenterY + iconScale * 0.1 }, // 8: 横线2起点
        { x: iconCenterX + iconScale * 0.05, y: iconCenterY + iconScale * 0.1 }, // 9: 横线2终点
      ];
      connections = [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], // 外框
        [4, 5], [5, 3], // 折角
        [6, 7], [8, 9], // 横线
      ];
    } else if (iconType === 'palette') {
      // UI 窗口/界面 icon
      cornerIndices = [0, 1, 2, 3]; // 窗口四角
      
      // 窗口尺寸
      const winW = iconScale * 0.7;
      const winH = iconScale * 0.55;
      const titleBarH = iconScale * 0.12;
      
      targetPoints = [
        // 窗口外框（4个角点）
        { x: iconCenterX - winW * 0.5, y: iconCenterY - winH * 0.5 }, // 0: 左上
        { x: iconCenterX + winW * 0.5, y: iconCenterY - winH * 0.5 }, // 1: 右上
        { x: iconCenterX + winW * 0.5, y: iconCenterY + winH * 0.5 }, // 2: 右下
        { x: iconCenterX - winW * 0.5, y: iconCenterY + winH * 0.5 }, // 3: 左下
        // 标题栏分隔线
        { x: iconCenterX - winW * 0.5, y: iconCenterY - winH * 0.5 + titleBarH }, // 4: 标题栏左
        { x: iconCenterX + winW * 0.5, y: iconCenterY - winH * 0.5 + titleBarH }, // 5: 标题栏右
        // 标题栏按钮（3个小点）
        { x: iconCenterX - winW * 0.35, y: iconCenterY - winH * 0.5 + titleBarH * 0.5 }, // 6: 按钮1
        { x: iconCenterX - winW * 0.25, y: iconCenterY - winH * 0.5 + titleBarH * 0.5 }, // 7: 按钮2
        { x: iconCenterX - winW * 0.15, y: iconCenterY - winH * 0.5 + titleBarH * 0.5 }, // 8: 按钮3
        // 内容区域 - 左侧边栏
        { x: iconCenterX - winW * 0.3, y: iconCenterY - winH * 0.5 + titleBarH }, // 9: 边栏顶
        { x: iconCenterX - winW * 0.3, y: iconCenterY + winH * 0.5 }, // 10: 边栏底
        // 内容区域 - 内容块1
        { x: iconCenterX - winW * 0.15, y: iconCenterY - winH * 0.1 }, // 11: 块1左上
        { x: iconCenterX + winW * 0.35, y: iconCenterY - winH * 0.1 }, // 12: 块1右上
        { x: iconCenterX + winW * 0.35, y: iconCenterY + winH * 0.15 }, // 13: 块1右下
        { x: iconCenterX - winW * 0.15, y: iconCenterY + winH * 0.15 }, // 14: 块1左下
      ];
      connections = [
        // 窗口外框
        [0, 1], [1, 2], [2, 3], [3, 0],
        // 标题栏分隔线
        [4, 5],
        // 左侧边栏
        [9, 10],
        // 内容块
        [11, 12], [12, 13], [13, 14], [14, 11],
      ];
    } else if (iconType === 'code') {
      // 代码符号 </> icon - 参考标准比例
      cornerIndices = [0, 1, 2, 3, 4, 5, 6, 8]; // 尖角和斜杠端点
      
      // 标准比例：括号紧凑，斜杠穿过中间
      const h = iconScale * 0.35; // 括号半高
      const w = iconScale * 0.2; // 括号宽度
      const gap = iconScale * 0.18; // 括号与斜杠的间距
      
      targetPoints = [
        // 左尖括号 <
        { x: iconCenterX - gap - w * 0.3, y: iconCenterY - h }, // 0: < 顶部
        { x: iconCenterX - gap - w, y: iconCenterY }, // 1: < 尖端
        { x: iconCenterX - gap - w * 0.3, y: iconCenterY + h }, // 2: < 底部
        // 右尖括号 >
        { x: iconCenterX + gap + w * 0.3, y: iconCenterY - h }, // 3: > 顶部
        { x: iconCenterX + gap + w, y: iconCenterY }, // 4: > 尖端
        { x: iconCenterX + gap + w * 0.3, y: iconCenterY + h }, // 5: > 底部
        // 斜杠 / （在中间，与括号高度一致）
        { x: iconCenterX + iconScale * 0.08, y: iconCenterY - h }, // 6: / 顶部
        { x: iconCenterX, y: iconCenterY }, // 7: / 中间
        { x: iconCenterX - iconScale * 0.08, y: iconCenterY + h }, // 8: / 底部
      ];
      connections = [
        [0, 1], [1, 2], // 左尖括号
        [3, 4], [4, 5], // 右尖括号
        [6, 7], [7, 8], // 斜杠
      ];
    } else if (iconType === 'rocket') {
      // 火箭 icon 🚀 - 45°倾斜向右上方飞行的经典火箭
      const size = iconScale * 0.5;
      const angle = -Math.PI / 4; // -45度（向右上）
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      // 旋转辅助函数
      const rotate = (x: number, y: number) => ({
        x: iconCenterX + x * cos - y * sin,
        y: iconCenterY + x * sin + y * cos
      });
      
      // 基于中心点的相对坐标，然后旋转
      targetPoints = [
        // 火箭尖端
        rotate(0, -size * 1.0), // 0: 顶点
        
        // 火箭头部曲线
        rotate(-size * 0.25, -size * 0.6), // 1: 头部左
        rotate(size * 0.25, -size * 0.6), // 2: 头部右
        
        // 机身
        rotate(-size * 0.3, -size * 0.2), // 3: 机身上左
        rotate(size * 0.3, -size * 0.2), // 4: 机身上右
        rotate(-size * 0.3, size * 0.4), // 5: 机身下左
        rotate(size * 0.3, size * 0.4), // 6: 机身下右
        
        // 左尾翼（向左下延伸）
        rotate(-size * 0.7, size * 0.7), // 7: 左翼尖端
        rotate(-size * 0.3, size * 0.2), // 8: 左翼根部上
        rotate(-size * 0.3, size * 0.55), // 9: 左翼根部下
        
        // 右尾翼（向右延伸，但因为倾斜所以看起来在下方）
        rotate(size * 0.7, size * 0.7), // 10: 右翼尖端
        rotate(size * 0.3, size * 0.2), // 11: 右翼根部上
        rotate(size * 0.3, size * 0.55), // 12: 右翼根部下
        
        // 尾焰（从底部喷出）
        rotate(-size * 0.15, size * 0.5), // 13: 左焰起点
        rotate(-size * 0.25, size * 0.9), // 14: 左焰终点
        rotate(0, size * 0.5), // 15: 中焰起点
        rotate(0, size * 1.05), // 16: 中焰终点
        rotate(size * 0.15, size * 0.5), // 17: 右焰起点
        rotate(size * 0.25, size * 0.9), // 18: 右焰终点
        
        // 舷窗
        rotate(0, -size * 0.3), // 19: 舷窗
      ];
      
      // 关键点（会更亮更大）
      cornerIndices = [0, 7, 10, 14, 16, 18, 19];
      
      connections = [
        // 火箭头部
        [0, 1], [0, 2], [1, 2],
        // 机身轮廓
        [1, 3], [3, 5],
        [2, 4], [4, 6],
        [5, 6],
        // 左尾翼
        [8, 7], [7, 9], [9, 5],
        // 右尾翼
        [11, 10], [10, 12], [12, 6],
        // 尾焰
        [13, 14], [15, 16], [17, 18],
      ];
      
      // 流动路径
      flowPaths = [
        [14, 13, 5, 3, 1, 0],
        [16, 15, 5, 3, 1, 0],
        [16, 15, 6, 4, 2, 0],
        [18, 17, 6, 4, 2, 0],
      ];
    } else if (iconType === 'building') {
      // 建筑/高楼 icon 🏢
      cornerIndices = [0, 1, 2, 3];
      const buildW = iconScale * 0.3;
      const buildH = iconScale * 0.45;
      
      targetPoints = [
        // 建筑外框
        { x: iconCenterX - buildW, y: iconCenterY - buildH }, // 0: 左上
        { x: iconCenterX + buildW, y: iconCenterY - buildH }, // 1: 右上
        { x: iconCenterX + buildW, y: iconCenterY + buildH }, // 2: 右下
        { x: iconCenterX - buildW, y: iconCenterY + buildH }, // 3: 左下
        // 门
        { x: iconCenterX - buildW * 0.3, y: iconCenterY + buildH }, // 4: 门左
        { x: iconCenterX + buildW * 0.3, y: iconCenterY + buildH }, // 5: 门右
        { x: iconCenterX - buildW * 0.3, y: iconCenterY + buildH * 0.5 }, // 6: 门左上
        { x: iconCenterX + buildW * 0.3, y: iconCenterY + buildH * 0.5 }, // 7: 门右上
        // 窗户
        { x: iconCenterX - buildW * 0.5, y: iconCenterY - buildH * 0.5 }, // 8: 窗1
        { x: iconCenterX + buildW * 0.5, y: iconCenterY - buildH * 0.5 }, // 9: 窗2
        { x: iconCenterX - buildW * 0.5, y: iconCenterY }, // 10: 窗3
        { x: iconCenterX + buildW * 0.5, y: iconCenterY }, // 11: 窗4
      ];
      connections = [
        [0, 1], [1, 2], [2, 3], [3, 0], // 外框
        [4, 6], [5, 7], [6, 7], // 门
      ];
    } else if (iconType === 'flowchart') {
      // 流程图 icon
      cornerIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const boxSize = iconScale * 0.15;
      const boxGap = iconScale * 0.25;
      
      targetPoints = [
        // 顶部方块
        { x: iconCenterX - boxSize, y: iconCenterY - boxGap - boxSize }, // 0
        { x: iconCenterX + boxSize, y: iconCenterY - boxGap - boxSize }, // 1
        { x: iconCenterX + boxSize, y: iconCenterY - boxGap + boxSize }, // 2
        { x: iconCenterX - boxSize, y: iconCenterY - boxGap + boxSize }, // 3
        // 底部左方块
        { x: iconCenterX - boxGap - boxSize, y: iconCenterY + boxGap - boxSize }, // 4
        { x: iconCenterX - boxGap + boxSize, y: iconCenterY + boxGap - boxSize }, // 5
        { x: iconCenterX - boxGap + boxSize, y: iconCenterY + boxGap + boxSize }, // 6
        { x: iconCenterX - boxGap - boxSize, y: iconCenterY + boxGap + boxSize }, // 7
        // 底部右方块
        { x: iconCenterX + boxGap - boxSize, y: iconCenterY + boxGap - boxSize }, // 8
        { x: iconCenterX + boxGap + boxSize, y: iconCenterY + boxGap - boxSize }, // 9
        { x: iconCenterX + boxGap + boxSize, y: iconCenterY + boxGap + boxSize }, // 10
        { x: iconCenterX + boxGap - boxSize, y: iconCenterY + boxGap + boxSize }, // 11
        // 连接点
        { x: iconCenterX, y: iconCenterY - boxGap + boxSize }, // 12: 顶部方块底
        { x: iconCenterX, y: iconCenterY }, // 13: 中心
        { x: iconCenterX - boxGap, y: iconCenterY }, // 14: 左连接
        { x: iconCenterX + boxGap, y: iconCenterY }, // 15: 右连接
        { x: iconCenterX - boxGap, y: iconCenterY + boxGap - boxSize }, // 16: 左方块顶
        { x: iconCenterX + boxGap, y: iconCenterY + boxGap - boxSize }, // 17: 右方块顶
      ];
      connections = [
        [0, 1], [1, 2], [2, 3], [3, 0], // 顶部方块
        [4, 5], [5, 6], [6, 7], [7, 4], // 左方块
        [8, 9], [9, 10], [10, 11], [11, 8], // 右方块
        [12, 13], [13, 14], [13, 15], [14, 16], [15, 17], // 连接线
      ];
    } else if (iconType === 'monitor') {
      // 显示器 icon 🖥️
      cornerIndices = [0, 1, 2, 3];
      const monW = iconScale * 0.4;
      const monH = iconScale * 0.3;
      
      targetPoints = [
        // 屏幕
        { x: iconCenterX - monW, y: iconCenterY - monH }, // 0: 左上
        { x: iconCenterX + monW, y: iconCenterY - monH }, // 1: 右上
        { x: iconCenterX + monW, y: iconCenterY + monH * 0.4 }, // 2: 右下
        { x: iconCenterX - monW, y: iconCenterY + monH * 0.4 }, // 3: 左下
        // 支架
        { x: iconCenterX - iconScale * 0.08, y: iconCenterY + monH * 0.4 }, // 4
        { x: iconCenterX + iconScale * 0.08, y: iconCenterY + monH * 0.4 }, // 5
        { x: iconCenterX - iconScale * 0.08, y: iconCenterY + monH * 0.7 }, // 6
        { x: iconCenterX + iconScale * 0.08, y: iconCenterY + monH * 0.7 }, // 7
        // 底座
        { x: iconCenterX - iconScale * 0.2, y: iconCenterY + monH * 0.7 }, // 8
        { x: iconCenterX + iconScale * 0.2, y: iconCenterY + monH * 0.7 }, // 9
        { x: iconCenterX - iconScale * 0.2, y: iconCenterY + monH }, // 10
        { x: iconCenterX + iconScale * 0.2, y: iconCenterY + monH }, // 11
      ];
      connections = [
        [0, 1], [1, 2], [2, 3], [3, 0], // 屏幕
        [4, 6], [5, 7], // 支架
        [8, 9], [9, 11], [11, 10], [10, 8], // 底座
      ];
    } else if (iconType === 'linechart') {
      // 折线图 icon 📈
      cornerIndices = [0, 3, 4, 5, 6, 7];
      const chartW = iconScale * 0.4;
      const chartH = iconScale * 0.35;
      
      targetPoints = [
        // 坐标轴
        { x: iconCenterX - chartW, y: iconCenterY - chartH }, // 0: Y轴顶
        { x: iconCenterX - chartW, y: iconCenterY + chartH }, // 1: 原点
        { x: iconCenterX + chartW, y: iconCenterY + chartH }, // 2: X轴右
        // 箭头
        { x: iconCenterX - chartW - iconScale * 0.05, y: iconCenterY - chartH + iconScale * 0.08 }, // 3: Y箭头左
        { x: iconCenterX - chartW + iconScale * 0.05, y: iconCenterY - chartH + iconScale * 0.08 }, // 4: Y箭头右
        // 折线数据点
        { x: iconCenterX - chartW * 0.6, y: iconCenterY + chartH * 0.3 }, // 5: 点1
        { x: iconCenterX - chartW * 0.1, y: iconCenterY - chartH * 0.2 }, // 6: 点2
        { x: iconCenterX + chartW * 0.3, y: iconCenterY + chartH * 0.1 }, // 7: 点3
        { x: iconCenterX + chartW * 0.7, y: iconCenterY - chartH * 0.5 }, // 8: 点4
      ];
      connections = [
        [0, 1], [1, 2], // 坐标轴
        [0, 3], [0, 4], // Y轴箭头
        [5, 6], [6, 7], [7, 8], // 折线
      ];
    } else if (iconType === 'operation') {
      // 运营 icon - 两个叠加的圆形头像（代表团队/用户管理）
      const headRadius = iconScale * 0.14;
      const bodyW = iconScale * 0.28;
      const bodyH = iconScale * 0.18;
      
      // 前面的人（右侧，稍大）
      const frontOffsetX = iconScale * 0.12;
      const frontOffsetY = iconScale * 0.05;
      
      // 后面的人（左侧，稍小）
      const backOffsetX = -iconScale * 0.15;
      const backOffsetY = -iconScale * 0.08;
      const backScale = 0.85;
      
      targetPoints = [
        // 前面的人 - 头部圆形（8个点）
        { x: iconCenterX + frontOffsetX, y: iconCenterY + frontOffsetY - iconScale * 0.2 - headRadius }, // 0
        { x: iconCenterX + frontOffsetX + headRadius * 0.7, y: iconCenterY + frontOffsetY - iconScale * 0.2 - headRadius * 0.7 }, // 1
        { x: iconCenterX + frontOffsetX + headRadius, y: iconCenterY + frontOffsetY - iconScale * 0.2 }, // 2
        { x: iconCenterX + frontOffsetX + headRadius * 0.7, y: iconCenterY + frontOffsetY - iconScale * 0.2 + headRadius * 0.7 }, // 3
        { x: iconCenterX + frontOffsetX, y: iconCenterY + frontOffsetY - iconScale * 0.2 + headRadius }, // 4
        { x: iconCenterX + frontOffsetX - headRadius * 0.7, y: iconCenterY + frontOffsetY - iconScale * 0.2 + headRadius * 0.7 }, // 5
        { x: iconCenterX + frontOffsetX - headRadius, y: iconCenterY + frontOffsetY - iconScale * 0.2 }, // 6
        { x: iconCenterX + frontOffsetX - headRadius * 0.7, y: iconCenterY + frontOffsetY - iconScale * 0.2 - headRadius * 0.7 }, // 7
        // 前面的人 - 身体弧形
        { x: iconCenterX + frontOffsetX - bodyW, y: iconCenterY + frontOffsetY + bodyH }, // 8
        { x: iconCenterX + frontOffsetX - bodyW * 0.6, y: iconCenterY + frontOffsetY + bodyH * 0.2 }, // 9
        { x: iconCenterX + frontOffsetX, y: iconCenterY + frontOffsetY }, // 10
        { x: iconCenterX + frontOffsetX + bodyW * 0.6, y: iconCenterY + frontOffsetY + bodyH * 0.2 }, // 11
        { x: iconCenterX + frontOffsetX + bodyW, y: iconCenterY + frontOffsetY + bodyH }, // 12
        
        // 后面的人 - 头部圆形（8个点，稍小）
        { x: iconCenterX + backOffsetX, y: iconCenterY + backOffsetY - iconScale * 0.2 - headRadius * backScale }, // 13
        { x: iconCenterX + backOffsetX + headRadius * backScale * 0.7, y: iconCenterY + backOffsetY - iconScale * 0.2 - headRadius * backScale * 0.7 }, // 14
        { x: iconCenterX + backOffsetX + headRadius * backScale, y: iconCenterY + backOffsetY - iconScale * 0.2 }, // 15
        { x: iconCenterX + backOffsetX + headRadius * backScale * 0.7, y: iconCenterY + backOffsetY - iconScale * 0.2 + headRadius * backScale * 0.7 }, // 16
        { x: iconCenterX + backOffsetX, y: iconCenterY + backOffsetY - iconScale * 0.2 + headRadius * backScale }, // 17
        { x: iconCenterX + backOffsetX - headRadius * backScale * 0.7, y: iconCenterY + backOffsetY - iconScale * 0.2 + headRadius * backScale * 0.7 }, // 18
        { x: iconCenterX + backOffsetX - headRadius * backScale, y: iconCenterY + backOffsetY - iconScale * 0.2 }, // 19
        { x: iconCenterX + backOffsetX - headRadius * backScale * 0.7, y: iconCenterY + backOffsetY - iconScale * 0.2 - headRadius * backScale * 0.7 }, // 20
        // 后面的人 - 身体弧形
        { x: iconCenterX + backOffsetX - bodyW * backScale, y: iconCenterY + backOffsetY + bodyH * backScale }, // 21
        { x: iconCenterX + backOffsetX - bodyW * backScale * 0.6, y: iconCenterY + backOffsetY + bodyH * backScale * 0.2 }, // 22
        { x: iconCenterX + backOffsetX, y: iconCenterY + backOffsetY }, // 23
        { x: iconCenterX + backOffsetX + bodyW * backScale * 0.6, y: iconCenterY + backOffsetY + bodyH * backScale * 0.2 }, // 24
        { x: iconCenterX + backOffsetX + bodyW * backScale, y: iconCenterY + backOffsetY + bodyH * backScale }, // 25
      ];
      
      cornerIndices = [0, 2, 4, 6, 8, 12, 13, 15, 17, 19, 21, 25];
      
      connections = [
        // 前面的人 - 头部圆形
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
        // 前面的人 - 身体弧形
        [8, 9], [9, 10], [10, 11], [11, 12],
        // 后面的人 - 头部圆形
        [13, 14], [14, 15], [15, 16], [16, 17], [17, 18], [18, 19], [19, 20], [20, 13],
        // 后面的人 - 身体弧形
        [21, 22], [22, 23], [23, 24], [24, 25],
      ];
    }

    return { targetPoints, connections, cornerIndices, flowPaths };
  };

  // 初始化星星
  useEffect(() => {
    const { width, height } = size;
    if (width === 0 || height === 0) return;
    if (initializedRef.current) return; // 只初始化一次
    
    const stars: Star[] = [];
    const { targetPoints, connections, cornerIndices, flowPaths } = generateIconData(width, height, iconType);
    
    // 将画布分成网格区域（用于 scattered 模式）
    const gridCols = 5;
    const gridRows = 4;
    const cellWidth = width / gridCols;
    const cellHeight = height / gridRows;
    
    // 轮廓模式的偏移范围（静态时围绕目标点的偏移距离）
    const outlineOffset = staticMode === 'outline' ? 25 : 0;

    if (staticMode === 'flowing' && flowPaths && flowPaths.length > 0) {
      // 流动模式：创建沿路径流动的粒子
      const particlesPerPath = 8; // 每条路径的粒子数
      
      flowPaths.forEach((path, pathIndex) => {
        for (let i = 0; i < particlesPerPath; i++) {
          const progress = i / particlesPerPath; // 初始进度均匀分布
          const pathPointIndex = Math.floor(progress * (path.length - 1));
          const nextPointIndex = Math.min(pathPointIndex + 1, path.length - 1);
          const localProgress = (progress * (path.length - 1)) % 1;
          
          const currentPoint = targetPoints[path[pathPointIndex]];
          const nextPoint = targetPoints[path[nextPointIndex]];
          
          const x = currentPoint.x + (nextPoint.x - currentPoint.x) * localProgress;
          const y = currentPoint.y + (nextPoint.y - currentPoint.y) * localProgress;
          
          stars.push({
            x,
            y,
            targetX: x,
            targetY: y,
            startX: x,
            startY: y,
            size: Math.random() * 0.8 + 0.8,
            opacity: Math.random() * 0.3 + 0.4,
            twinkleSpeed: Math.random() * 1.5 + 1.0,
            twinkleOffset: Math.random() * Math.PI * 2,
            driftX: 0,
            driftY: 0,
            connectedTo: [],
            pathProgress: progress,
            pathSpeed: 0.003 + Math.random() * 0.002, // 不同粒子速度略有不同
            pathIndex,
          });
        }
      });
    } else {
      // 非流动模式：使用原有逻辑
      const extraStars = staticMode === 'outline' ? 8 : 15;
      const totalStars = targetPoints.length + extraStars;
      
      // 创建关键点的星星
      targetPoints.forEach((target, index) => {
        let startX: number, startY: number;
        
        if (staticMode === 'outline') {
          // 轮廓模式：围绕目标点分布，形成松散的轮廓
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * outlineOffset + 10;
          startX = target.x + Math.cos(angle) * distance;
          startY = target.y + Math.sin(angle) * distance;
        } else {
          // 分散模式：均匀分布在整个卡片区域
          const gridIndex = index % (gridCols * gridRows);
          const gridX = gridIndex % gridCols;
          const gridY = Math.floor(gridIndex / gridCols);
          startX = gridX * cellWidth + Math.random() * cellWidth;
          startY = gridY * cellHeight + Math.random() * cellHeight;
        }
        
        const isCorner = cornerIndices.includes(index);

        stars.push({
          x: startX,
          y: startY,
          targetX: target.x,
          targetY: target.y,
          startX,
          startY,
          size: isCorner ? (Math.random() * 0.5 + 1.5) : (Math.random() * 0.6 + 0.8),
          opacity: isCorner ? (Math.random() * 0.2 + 0.7) : (Math.random() * 0.3 + 0.5),
          twinkleSpeed: Math.random() * 1.5 + 1.0,
          twinkleOffset: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * (staticMode === 'outline' ? 8 : 12),
          driftY: (Math.random() - 0.5) * (staticMode === 'outline' ? 8 : 12),
          connectedTo: [],
        });
      });

      // 创建额外的装饰星星
      for (let i = targetPoints.length; i < totalStars; i++) {
        let startX: number, startY: number;
        const nearestTargetIndex = Math.floor(Math.random() * targetPoints.length);
        const nearestTarget = targetPoints[nearestTargetIndex];
        
        if (staticMode === 'outline') {
          // 轮廓模式：装饰星星也围绕目标点分布
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * outlineOffset * 1.5 + 15;
          startX = nearestTarget.x + Math.cos(angle) * distance;
          startY = nearestTarget.y + Math.sin(angle) * distance;
        } else {
          // 分散模式：均匀分布在整个卡片区域
          const gridIndex = i % (gridCols * gridRows);
          const gridX = gridIndex % gridCols;
          const gridY = Math.floor(gridIndex / gridCols);
          startX = gridX * cellWidth + Math.random() * cellWidth;
          startY = gridY * cellHeight + Math.random() * cellHeight;
        }
        
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;

        stars.push({
          x: startX,
          y: startY,
          targetX: nearestTarget.x + offsetX,
          targetY: nearestTarget.y + offsetY,
          startX,
          startY,
          size: Math.random() * 0.6 + 0.5,
          opacity: Math.random() * 0.25 + 0.35,
          twinkleSpeed: Math.random() * 2.0 + 1.0,
          twinkleOffset: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * (staticMode === 'outline' ? 10 : 15),
          driftY: (Math.random() - 0.5) * (staticMode === 'outline' ? 10 : 15),
          connectedTo: [],
        });
      }

      // 分配连线关系
      connections.forEach(([from, to]) => {
        if (stars[from] && stars[to]) {
          if (!stars[from].connectedTo.includes(to)) {
            stars[from].connectedTo.push(to);
          }
          if (!stars[to].connectedTo.includes(from)) {
            stars[to].connectedTo.push(from);
          }
        }
      });
    }

    starsRef.current = stars;
    initializedRef.current = true;
  }, [size, iconType, staticMode]);

  // 监听 hover 状态变化
  useEffect(() => {
    if (isHovered) {
      // hover 开始时，保存当前星星位置作为动画起点
      starsRef.current.forEach(star => {
        // 如果星星不在目标位置附近，使用当前位置作为起点
        const distToTarget = Math.sqrt(Math.pow(star.x - star.targetX, 2) + Math.pow(star.y - star.targetY, 2));
        if (distToTarget > 5) {
          star.startX = star.x;
          star.startY = star.y;
        }
      });
      hoverStartTimeRef.current = Date.now();
      setIsAnimating(true);
    } else {
      // 离开 hover 时，保存当前位置作为返回动画起点
      // startX/startY 保持为初始随机位置（目标返回位置）
      leaveStartTimeRef.current = Date.now();
      setIsAnimating(true);
    }
  }, [isHovered]);

  // 动画循环
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = size;
    if (width === 0 || height === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // 获取流动路径数据（用于流动模式）
    const { targetPoints, flowPaths } = generateIconData(width, height, iconType);

    const animate = () => {
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, width, height);

      const currentColor = isHovered ? hoverColor : staticColor;
      const colorMatch = currentColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      const [, r, g, b] = colorMatch || ['255', '255', '255'];

      starsRef.current.forEach((star, index) => {
        let currentX = star.x;
        let currentY = star.y;

        // 流动模式：粒子沿路径持续流动
        if (staticMode === 'flowing' && star.pathProgress !== undefined && star.pathIndex !== undefined && flowPaths) {
          const path = flowPaths[star.pathIndex];
          if (path && path.length > 1) {
            // 更新进度
            star.pathProgress = (star.pathProgress + (star.pathSpeed || 0.003)) % 1;
            
            // 计算当前在路径上的位置
            const totalSegments = path.length - 1;
            const segmentProgress = star.pathProgress * totalSegments;
            const segmentIndex = Math.floor(segmentProgress);
            const localProgress = segmentProgress - segmentIndex;
            
            const fromPointIndex = path[Math.min(segmentIndex, path.length - 1)];
            const toPointIndex = path[Math.min(segmentIndex + 1, path.length - 1)];
            
            const fromPoint = targetPoints[fromPointIndex];
            const toPoint = targetPoints[toPointIndex];
            
            if (fromPoint && toPoint) {
              currentX = fromPoint.x + (toPoint.x - fromPoint.x) * localProgress;
              currentY = fromPoint.y + (toPoint.y - fromPoint.y) * localProgress;
              star.x = currentX;
              star.y = currentY;
            }
          }
          
          // 流动模式的透明度：头部亮，尾部暗
          const fadeInOut = Math.sin(star.pathProgress * Math.PI) * 0.5 + 0.5;
          const twinkle = Math.sin(timeRef.current * star.twinkleSpeed + star.twinkleOffset) * 0.2 + 0.8;
          const opacity = star.opacity * fadeInOut * twinkle * (isHovered ? 1.3 : 1);
          
          // 绘制流动粒子
          const starSize = star.size * (isHovered ? 1.5 : 1);
          ctx.beginPath();
          ctx.arc(currentX, currentY, starSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.fill();
          
          // 添加拖尾光晕
          const glowSize = starSize * 3;
          const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, glowSize);
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`);
          gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacity * 0.15})`);
          gradient.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(currentX, currentY, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          
        } else {
          // 非流动模式：原有逻辑
          if (isHovered && isAnimating) {
            // hover 时：平滑移动到目标位置
            const elapsed = (Date.now() - hoverStartTimeRef.current) / 1000;
            const duration = 0.8; // 动画时长（秒）
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数（ease-out）
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            // 从初始位置移动到目标位置
            currentX = star.startX + (star.targetX - star.startX) * easeProgress;
            currentY = star.startY + (star.targetY - star.startY) * easeProgress;
            
            star.x = currentX;
            star.y = currentY;
            
            // 动画完成后停止
            if (progress >= 1) {
              setIsAnimating(false);
            }
          } else if (!isHovered && isAnimating) {
            // 离开 hover 时：平滑返回到初始位置
            const elapsed = (Date.now() - leaveStartTimeRef.current) / 1000;
            const duration = 0.6; // 返回动画时长（秒）
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数（ease-out）
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            // 从当前位置返回到初始位置
            const fromX = star.x;
            const fromY = star.y;
            
            currentX = fromX + (star.startX - fromX) * easeProgress;
            currentY = fromY + (star.startY - fromY) * easeProgress;
            
            star.x = currentX;
            star.y = currentY;
            
            // 动画完成后停止
            if (progress >= 1) {
              setIsAnimating(false);
            }
          } else if (!isHovered && !isAnimating) {
            // 静态时：随机轻微运动（基于初始位置）
            const driftX = Math.sin(timeRef.current * 0.3 + star.twinkleOffset) * star.driftX;
            const driftY = Math.cos(timeRef.current * 0.3 + star.twinkleOffset) * star.driftY;
            currentX = star.startX + driftX;
            currentY = star.startY + driftY;
          }

          // 闪烁效果
          const twinkle = Math.sin(timeRef.current * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
          const opacity = star.opacity * twinkle * (isHovered ? 1.2 : 1);

          // 绘制连线（仅在 hover 且星星接近目标位置时）
          if (isHovered) {
            const distanceToTarget = Math.sqrt(
              Math.pow(currentX - star.targetX, 2) + Math.pow(currentY - star.targetY, 2)
            );
            
            // 如果星星接近目标位置（距离 < 8px），绘制连线
            if (distanceToTarget < 8) {
              star.connectedTo.forEach(connectedIndex => {
                const connectedStar = starsRef.current[connectedIndex];
                if (connectedStar) {
                  const connectedDistance = Math.sqrt(
                    Math.pow(connectedStar.x - connectedStar.targetX, 2) + 
                    Math.pow(connectedStar.y - connectedStar.targetY, 2)
                  );
                  
                  // 如果连接的星星也接近目标位置，绘制连线
                  if (connectedDistance < 10) {
                    ctx.beginPath();
                    ctx.moveTo(currentX, currentY);
                    ctx.lineTo(connectedStar.x, connectedStar.y);
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.8})`;
                    ctx.lineWidth = 1.5; // 更粗的连线
                    ctx.stroke();
                  }
                }
              });
            }
          }

          // 绘制星星
          const starSize = isHovered ? star.size * 1.3 : star.size; // hover 时星星变大
          ctx.beginPath();
          ctx.arc(currentX, currentY, starSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.fill();

          // hover 时添加光晕（当星星接近目标位置时）
          if (isHovered) {
            const distanceToTarget = Math.sqrt(
              Math.pow(currentX - star.targetX, 2) + Math.pow(currentY - star.targetY, 2)
            );
            if (distanceToTarget < 10) {
              const glowSize = starSize * 4;
              const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, glowSize);
              gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.6})`);
              gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacity * 0.2})`);
              gradient.addColorStop(1, 'transparent');
              ctx.beginPath();
              ctx.arc(currentX, currentY, glowSize, 0, Math.PI * 2);
              ctx.fillStyle = gradient;
              ctx.fill();
            }
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size, isHovered, isAnimating, staticColor, hoverColor, staticMode, iconType]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        style={{ width: size.width, height: size.height }}
      />
    </div>
  );
};

export default ConstellationIcon;

