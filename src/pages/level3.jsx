// @ts-ignore;
import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast } from '@/components/ui';

const reverseAnimalData = {
  '大象馆': {
    direction: '南偏东',
    angle: '60',
    distance: '1500',
    altDirection: '东偏南',
    altAngle: '30',
    emoji: '🐘',
    image: 'https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E5%A4%A7%E8%B1%A11.png?sign=6bfbe7f2a183f3da5261c9faee674761&t=1758850706'
  },
  '斑马场': {
    direction: '北偏东',
    angle: '70',
    distance: '2000',
    altDirection: '东偏北',
    altAngle: '20',
    emoji: '🦓',
    image: 'https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E6%96%91%E9%A9%AC1.png?sign=16be367dfd407d36b658a1826272b098&t=1758850149'
  },
  '猴山': {
    direction: '北偏西',
    angle: '45',
    distance: '1000',
    altDirection: '西偏北',
    altAngle: '45',
    emoji: '🐒',
    image: 'https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E7%8C%B4%E5%B1%B11.png?sign=97140c5e30cf2fc41e40705d04b93866&t=1758858134'
  },
  '海洋馆': {
    direction: '南偏西',
    angle: '30',
    distance: '500',
    altDirection: '西偏南',
    altAngle: '60',
    emoji: '🐠',
    image: 'https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E6%B5%B7%E6%B4%8B%E9%A6%861.png?sign=bfe9f8d9d50ce992a8771923bcbdff77&t=1760501790'
  },
  '狮虎山': {
    direction: '西偏南',
    angle: '30',
    distance: '1000',
    altDirection: '南偏西',
    altAngle: '60',
    emoji: '🦁',
    image: 'https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E7%8B%AE%E8%99%8E%E5%B1%B11.png?sign=9216e4ad92845c4edd7a9c8f2c2f2dcb&t=1758858016'
  }
};
export default function Level3(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [direction, setDirection] = useState('');
  const [angle, setAngle] = useState('');
  const [distance, setDistance] = useState('');
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showMedal, setShowMedal] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showDrawingTool, setShowDrawingTool] = useState(false);
  const [showResetPasswordInput, setShowResetPasswordInput] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // 新增：第一关画图功能状态
  const [brushColor, setBrushColor] = useState('#ff0000'); // 默认红色
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isFreeDrawingMode, setIsFreeDrawingMode] = useState(false); // 自由绘画模式
  const [drawingMode, setDrawingMode] = useState('free'); // 'free' 或 'line'

  // 新增：方向标功能状态
  const [showCompass, setShowCompass] = useState(false);
  const [compassPosition, setCompassPosition] = useState({
    x: 200,
    y: 150
  });
  const [isDraggingCompass, setIsDraggingCompass] = useState(false);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0
  });
  const compassRef = useRef(null);

  // 预定义颜色选项
  const colorOptions = ['#ff0000',
  // 红色
  '#0000ff',
  // 蓝色
  '#00ff00',
  // 绿色
  '#ffff00',
  // 黄色
  '#ff00ff',
  // 粉色
  '#000000' // 黑色
  ];

  // 获取学生标识
  const getStudentId = () => {
    return `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // 初始化画布
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';

      // 重新绘制所有线段
      lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.startX, line.startY);
        ctx.lineTo(line.endX, line.endY);
        ctx.stroke();
      });
    }
  };

  // 开始绘制（自由绘画模式）
  const startFreeDrawing = e => {
    if (!isFreeDrawingMode) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  // 自由绘画中
  const freeDraw = e => {
    if (!isDrawing || !isFreeDrawingMode) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  // 开始绘制线段（辅助线模式）
  const startLineDrawing = e => {
    if (!isDrawingMode) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    setIsDrawing(true);
    setLines(prev => [...prev, {
      startX,
      startY,
      endX: startX,
      endY: startY
    }]);
  };

  // 绘制线段 - 限制只能绘制水平或垂直线
  const drawLine = e => {
    if (!isDrawing || !isDrawingMode) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    // 获取当前线段起点
    const currentLine = lines[lines.length - 1];
    const startX = currentLine.startX;
    const startY = currentLine.startY;

    // 计算水平和垂直方向的移动距离
    const deltaX = Math.abs(endX - startX);
    const deltaY = Math.abs(endY - startY);

    // 限制只能绘制水平或垂直线
    let restrictedEndX = endX;
    let restrictedEndY = endY;
    if (deltaX > deltaY) {
      // 水平线 - 保持Y坐标不变
      restrictedEndY = startY;
    } else {
      // 垂直线 - 保持X坐标不变
      restrictedEndX = startX;
    }
    setLines(prev => {
      const newLines = [...prev];
      newLines[newLines.length - 1] = {
        ...newLines[newLines.length - 1],
        endX: restrictedEndX,
        endY: restrictedEndY
      };
      return newLines;
    });
  };

  // 结束绘制
  const endDrawing = () => {
    setIsDrawing(false);
  };

  // 清除所有线段和绘画
  const clearCanvas = () => {
    setLines([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    toast({
      title: "已清除",
      description: "所有绘画内容已清除",
      duration: 1000
    });
  };

  // 切换绘图模式
  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
    setIsFreeDrawingMode(false);
    if (!isDrawingMode) {
      toast({
        title: "辅助线模式已开启",
        description: "点击地图开始画辅助线，只能绘制水平或垂直的线段",
        duration: 2000
      });
    } else {
      toast({
        title: "辅助线模式已关闭",
        description: "点击地图不再绘制辅助线",
        duration: 2000
      });
    }
  };

  // 切换自由绘画模式
  const toggleFreeDrawingMode = () => {
    setIsFreeDrawingMode(!isFreeDrawingMode);
    setIsDrawingMode(false);
    if (!isFreeDrawingMode) {
      toast({
        title: "自由绘画模式已开启",
        description: "点击地图开始自由绘画标记",
        duration: 2000
      });
    } else {
      toast({
        title: "自由绘画模式已关闭",
        description: "点击地图不再进行绘画",
        duration: 2000
      });
    }
  };

  // 颜色选择
  const selectColor = color => {
    setBrushColor(color);
    setShowColorPicker(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = color;
    }
  };

  // 切换画图工具显示
  const toggleDrawingTool = () => {
    setShowDrawingTool(!showDrawingTool);
  };

  // 新增：切换方向标显示
  const toggleCompass = () => {
    setShowCompass(!showCompass);
    toast({
      title: showCompass ? "方向标已隐藏" : "方向标已显示",
      description: showCompass ? "方向标已从地图上移除" : "可以拖动方向标到任意位置",
      duration: 2000
    });
  };

  // 新增：开始拖拽方向标 - 支持触摸设备
  const startDraggingCompass = e => {
    if (!showCompass) return;
    setIsDraggingCompass(true);
    const rect = containerRef.current.getBoundingClientRect();

    // 获取触摸点或鼠标点的坐标
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // 修复：计算相对于容器左上角的偏移量，而不是当前位置
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    // 保存拖拽起始点相对于鼠标点击位置的偏移
    const startOffsetX = offsetX - compassPosition.x;
    const startOffsetY = offsetY - compassPosition.y;
    setDragStart({
      x: startOffsetX,
      y: startOffsetY
    });
    e.preventDefault();
  };

  // 新增：拖拽方向标中 - 支持触摸设备
  const dragCompass = e => {
    if (!isDraggingCompass || !showCompass) return;

    // 获取触摸点或鼠标点的坐标
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = containerRef.current.getBoundingClientRect();

    // 计算相对于容器左上角的坐标
    const containerX = clientX - rect.left;
    const containerY = clientY - rect.top;

    // 计算新的位置，减去拖拽起始偏移量
    const newX = containerX - dragStart.x;
    const newY = containerY - dragStart.y;

    // 限制在图片范围内 - 扩展向右移动范围，允许方向标超出图片右侧边缘
    const maxX = 500 + 80; // 图片宽度500px + 额外80px向右扩展
    const maxY = 400 - 160; // 图片高度400px - 方向标高度160px
    const boundedX = Math.max(-80, Math.min(newX, maxX)); // 允许向左超出80px，向右超出80px
    const boundedY = Math.max(0, Math.min(newY, maxY));
    setCompassPosition({
      x: boundedX,
      y: boundedY
    });
    e.preventDefault();
  };

  // 新增：结束拖拽方向标
  const endDraggingCompass = () => {
    setIsDraggingCompass(false);
  };

  // 记录工具勋章
  const recordToolMedal = async () => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'student_medals',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            studentId: getStudentId(),
            level: 'level3',
            medalType: '工具勋章',
            earnedAt: Date.now(),
            relatedAnimal: selectedAnimal,
            classId: 'all_classes'
          }
        }
      });

      // 显示勋章动画
      setShowMedal(true);
      setTimeout(() => {
        setShowMedal(false);
      }, 3000);
    } catch (error) {
      console.error('记录勋章失败:', error);
    }
  };

  // 加载总体完成人数统计
  const loadCompletionStats = async () => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'student_completion_status',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                level: {
                  $eq: 'level3'
                }
              }, {
                isCompleted: {
                  $eq: true
                }
              }]
            }
          },
          select: {
            studentId: true
          },
          getCount: true,
          pageSize: 1,
          pageNumber: 1
        }
      });
      setTotalCompleted(result.total || 0);
    } catch (error) {
      console.error('加载完成统计失败:', error);
    }
  };

  // 记录完成状态
  const recordCompletion = async () => {
    setIsLoading(true);
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'student_completion_status',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            studentId: getStudentId(),
            level: 'level3',
            isCompleted: true,
            completedAt: Date.now(),
            classId: 'all_classes',
            animalType: selectedAnimal
          }
        }
      });

      // 重新加载统计
      await loadCompletionStats();
    } catch (error) {
      console.error('记录完成状态失败:', error);
      toast({
        title: "记录失败",
        description: "网络错误，请重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 重置完成数据
  const resetCompletionData = async () => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'student_completion_status',
        methodName: 'wedaBatchDeleteV2',
        params: {
          filter: {
            where: {
              $and: [{
                level: {
                  $eq: 'level3'
                }
              }]
            }
          }
        }
      });
      toast({
        title: "重置成功",
        description: "完成人数统计已重置",
        duration: 2000
      });

      // 重新加载统计
      await loadCompletionStats();
    } catch (error) {
      console.error('重置数据失败:', error);
      toast({
        title: "重置失败",
        description: "网络错误，请重试",
        variant: "destructive"
      });
    }
  };

  // 验证重置密码
  const checkResetPassword = () => {
    if (resetPassword === 'KKK') {
      resetCompletionData();
      setShowResetPasswordInput(false);
      setResetPassword('');
    } else {
      toast({
        title: "密码错误",
        description: "请输入正确的重置密码",
        variant: "destructive"
      });
    }
  };
  const checkAnswer = async () => {
    if (!selectedAnimal || !direction || !angle || !distance) {
      toast({
        title: "请填写完整",
        description: "请选择场馆并填写完整的位置信息",
        variant: "destructive"
      });
      return;
    }
    const correctData = reverseAnimalData[selectedAnimal];
    const isCorrect = direction === correctData.direction && angle === correctData.angle && distance === correctData.distance || direction === correctData.altDirection && angle === correctData.altAngle && distance === correctData.distance;
    if (isCorrect) {
      // 记录完成状态
      await recordCompletion();
      // 记录工具勋章
      await recordToolMedal();
      toast({
        title: "任务完成！",
        description: `恭喜你！成功将工具还回营养中心！`,
        duration: 3000
      });
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
      audio.play();

      // 延迟一下再跳转，让学生看到成功提示
      setTimeout(() => {
        $w.utils.navigateTo({
          pageId: 'level2',
          params: {}
        });
      }, 2000);
    } else {
      toast({
        title: "再想想",
        description: "位置判断不正确，请重新尝试",
        variant: "destructive"
      });
    }
  };

  // 组件加载时获取统计
  useEffect(() => {
    loadCompletionStats();
  }, []);

  // 重绘画布
  useEffect(() => {
    initCanvas();
  }, [lines, brushColor]);

  // 新增：添加全局拖拽事件监听
  useEffect(() => {
    const handleMouseMove = e => dragCompass(e);
    const handleMouseUp = () => endDraggingCompass();
    const handleTouchMove = e => {
      e.preventDefault();
      dragCompass(e);
    };
    const handleTouchEnd = () => endDraggingCompass();
    if (isDraggingCompass) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false
      });
      document.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('touchcancel', handleTouchEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDraggingCompass, dragCompass, endDraggingCompass]);

  // 根据当前模式设置鼠标事件处理函数
  const getMouseDownHandler = () => {
    if (isFreeDrawingMode) return startFreeDrawing;
    if (isDrawingMode) return startLineDrawing;
    return () => {};
  };
  const getMouseMoveHandler = () => {
    if (isFreeDrawingMode) return freeDraw;
    if (isDrawingMode) return drawLine;
    return () => {};
  };
  return <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 工具勋章动画 */}
        {showMedal && <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="animate-bounce text-center">
              <div className="text-6xl mb-4">🛠️</div>
              <div className="text-2xl font-bold text-white bg-blue-500 px-6 py-3 rounded-full">
                获得工具勋章！
              </div>
            </div>
          </div>}

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-800">
              第三关：还回工具 🛠️
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 总体完成人数统计区域 */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-purple-800">总体完成人数：</h4>
                  <p className="text-2xl font-bold text-purple-600">{totalCompleted} 人</p>
                </div>
                {/* 重置按钮区域 */}
                <div className="flex items-center space-x-2">
                  {!showResetPasswordInput && <Button variant="outline" size="sm" onClick={() => setShowResetPasswordInput(true)} className="text-xs bg-white hover:bg-purple-100 border-purple-300">
                      重置统计
                    </Button>}
                  {showResetPasswordInput && <div className="flex items-center space-x-2">
                      <Input value={resetPassword} onChange={e => setResetPassword(e.target.value)} placeholder="输入密码" type="password" className="w-32 bg-white text-sm" />
                      <Button size="sm" onClick={checkResetPassword} className="bg-purple-500 hover:bg-purple-600 text-white text-xs">
                        确认
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                    setShowResetPasswordInput(false);
                    setResetPassword('');
                  }} className="text-xs border-gray-300 text-gray-600 hover:bg-gray-50">
                        取消
                      </Button>
                    </div>}
                </div>
              </div>
              <p className="text-xs text-purple-500 mt-2">已成功完成第三关的学生总数</p>
            </div>

            {/* 场馆选择区域 */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-yellow-800 mb-3">
                选择你当前所在的场馆：
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(reverseAnimalData).map(([animal, data]) => <button key={animal} onClick={() => setSelectedAnimal(animal)} className={`p-3 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${selectedAnimal === animal ? 'border-blue-400 bg-blue-100 shadow-md' : 'border-yellow-200 bg-white hover:bg-yellow-100'}`}>
                    <div className="text-center">
                      <div className="text-2xl mb-1">{data.emoji}</div>
                      <div className="text-sm font-medium text-gray-800">{animal}</div>
                    </div>
                  </button>)}
              </div>
            </div>

            {selectedAnimal && <div className="space-y-4">
                <div className="relative" ref={containerRef}>
                  <img src={reverseAnimalData[selectedAnimal].image} alt={selectedAnimal} className="mx-auto rounded-lg shadow-md w-full max-w-lg" />
                  
                  {/* 新增：可移动方向标 - 尺寸改为160px */}
                  {showCompass && <img ref={compassRef} src="https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E6%96%B9%E5%90%91%E6%A0%87%E8%93%9D.png?sign=903aa6f1119d1542de259f84eb7dcc39&t=1760487465" alt="方向标" className="absolute cursor-move transition-transform duration-200 hover:scale-110 z-10" style={{
                left: compassPosition.x,
                top: compassPosition.y,
                width: '160px',
                height: '160px',
                opacity: isDraggingCompass ? 0.8 : 1,
                transform: isDraggingCompass ? 'scale(1.1)' : 'scale(1)'
              }} onMouseDown={startDraggingCompass} onTouchStart={startDraggingCompass} />}
                  
                  <canvas ref={canvasRef} className="absolute top-0 left-1/2 transform -translate-x-1/2 cursor-crosshair" width={500} height={400} style={{
                touchAction: 'none',
                pointerEvents: isFreeDrawingMode || isDrawingMode ? 'auto' : 'none',
                opacity: isFreeDrawingMode || isDrawingMode ? 1 : 0.5
              }} onMouseDown={getMouseDownHandler()} onMouseMove={getMouseMoveHandler()} onMouseUp={endDrawing} onMouseLeave={endDrawing} onTouchStart={e => {
                e.preventDefault();
                if (isFreeDrawingMode) startFreeDrawing(e.touches[0]);
                if (isDrawingMode) startLineDrawing(e.touches[0]);
              }} onTouchMove={e => {
                e.preventDefault();
                if (isFreeDrawingMode) freeDraw(e.touches[0]);
                if (isDrawingMode) drawLine(e.touches[0]);
              }} onTouchEnd={endDrawing} />
                  
                  <p className="text-sm text-gray-600 mt-2">
                    {isFreeDrawingMode ? '✏️ 可以在图片上自由绘画标记' : isDrawingMode ? '📐 可以在图片上绘制辅助线' : showCompass ? '🧭 可以拖动方向标到任意位置' : `你现在在${selectedAnimal}，请判断营养中心的位置`}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-lg font-medium text-blue-800 mb-4">
                    营养中心在{selectedAnimal}的________（ ）°____米
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">方向</label>
                      <Input value={direction} onChange={e => setDirection(e.target.value)} placeholder="如：南偏东" className="bg-white border-blue-300" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">角度 (°)</label>
                      <Input value={angle} onChange={e => setAngle(e.target.value)} placeholder="如：60" type="number" className="bg-white border-blue-300" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">距离 (米)</label>
                      <Input value={distance} onChange={e => setDistance(e.target.value)} placeholder="如：1500" type="number" className="bg-white border-blue-300" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={checkAnswer} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" disabled={isLoading}>
                    {isLoading ? '归还中...' : `归还工具 ${reverseAnimalData[selectedAnimal].emoji}`}
                  </Button>
                </div>
              </div>}

            {/* 画图工具触发按钮 */}
            <div className="flex justify-center">
              <Button onClick={toggleDrawingTool} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-all duration-200 hover:scale-105 px-6">
                {showDrawingTool ? '隐藏画图工具' : '显示画图工具'}
              </Button>
            </div>

            {/* 画图工具控制区域 - 可隐藏 */}
            {showDrawingTool && <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-blue-800">画图工具</h4>
                  <div className="flex space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${isFreeDrawingMode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {isFreeDrawingMode ? '自由绘画' : ''}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${isDrawingMode ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                      {isDrawingMode ? '辅助线模式' : ''}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${showCompass ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                      {showCompass ? '方向标显示' : ''}
                    </span>
                  </div>
                </div>
                
                {/* 模式选择按钮 */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <Button onClick={toggleFreeDrawingMode} className={`${isFreeDrawingMode ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-200 hover:bg-gray-300'} text-white`}>
                    {isFreeDrawingMode ? '退出自由绘画' : '自由绘画'}
                  </Button>
                  <Button onClick={toggleDrawingMode} className={`${isDrawingMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-200 hover:bg-gray-300'} text-white`}>
                    {isDrawingMode ? '退出辅助线' : '辅助线'}
                  </Button>
                  <Button onClick={toggleCompass} className={`${showCompass ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-200 hover:bg-gray-300'} text-white`}>
                    {showCompass ? '隐藏方向标' : '显示方向标'}
                  </Button>
                </div>

                {/* 颜色选择器 */}
                <div className="mb-3">
                  <Button onClick={() => setShowColorPicker(!showColorPicker)} className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                    🎨 选择颜色
                  </Button>
                  {showColorPicker && <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 shadow-md">
                      <div className="grid grid-cols-6 gap-2">
                        {colorOptions.map(color => <button key={color} onClick={() => selectColor(color)} className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${brushColor === color ? 'border-blue-500 scale-110' : 'border-gray-300'}`} style={{
                    backgroundColor: color
                  }} title={color} />)}
                      </div>
                    </div>}
                </div>

                <Button onClick={clearCanvas} variant="outline" className="w-full bg-white hover:bg-red-50 text-red-600 border-red-300">
                  🗑️ 清除所有
                </Button>

                <p className="text-sm text-blue-600 mt-2">
                  {isFreeDrawingMode ? '点击地图开始自由绘画标记' : isDrawingMode ? '点击地图开始画辅助线，只能绘制水平或垂直的线段' : showCompass ? '拖动方向标到地图上的任意位置' : '选择一种绘画模式开始标记'}
                </p>
              </div>}

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => $w.utils.navigateTo({
              pageId: 'index',
              params: {}
            })} className="border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2 px-4 rounded-full">
                返回首页
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}