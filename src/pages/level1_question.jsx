// @ts-ignore;
import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Input, useToast } from '@/components/ui';

// @ts-ignore;
import { DrawingTools } from '@/components/DrawingTools';
// @ts-ignore;
import { AnswerInput } from '@/components/AnswerInput';
// @ts-ignore;
import { VideoOverlay } from '@/components/VideoOverlay';
export default function Level1Question(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [direction, setDirection] = useState('');
  const [angle, setAngle] = useState('');
  const [distance, setDistance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // 画图功能状态
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isFreeDrawingMode, setIsFreeDrawingMode] = useState(false);
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showDrawingTool, setShowDrawingTool] = useState(false);
  const [brushColor, setBrushColor] = useState('#ff0000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0
  });
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);

  // 方向标功能状态
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
  const colorOptions = ['#ff0000', '#0000ff', '#00ff00', '#ffff00', '#ff00ff', '#000000'];

  // 监听图片加载完成
  useEffect(() => {
    const handleImageLoad = () => {
      if (imageRef.current) {
        const width = imageRef.current.offsetWidth;
        const height = imageRef.current.offsetHeight;
        setImageSize({
          width,
          height
        });

        // 更新画布尺寸
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = width;
          canvas.height = height;
          initCanvas();
        }
      }
    };
    if (imageRef.current && imageRef.current.complete) {
      handleImageLoad();
    }
  }, []);

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

  // 开始自由绘画
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

  // 开始绘制线段
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

  // 绘制线段
  const drawLine = e => {
    if (!isDrawing || !isDrawingMode) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    const currentLine = lines[lines.length - 1];
    const startX = currentLine.startX;
    const startY = currentLine.startY;

    // 限制只能绘制水平或垂直线
    const deltaX = Math.abs(endX - startX);
    const deltaY = Math.abs(endY - startY);
    let restrictedEndX = endX;
    let restrictedEndY = endY;
    if (deltaX > deltaY) {
      restrictedEndY = startY;
    } else {
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

  // 清除画布
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

  // 切换辅助线模式
  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
    setIsFreeDrawingMode(false);
    toast({
      title: isDrawingMode ? "辅助线模式已关闭" : "辅助线模式已开启",
      description: isDrawingMode ? "点击地图不再绘制辅助线" : "点击地图开始画辅助线，只能绘制水平或垂直的线段",
      duration: 2000
    });
  };

  // 切换自由绘画模式
  const toggleFreeDrawingMode = () => {
    setIsFreeDrawingMode(!isFreeDrawingMode);
    setIsDrawingMode(false);
    toast({
      title: isFreeDrawingMode ? "自由绘画模式已关闭" : "自由绘画模式已开启",
      description: isFreeDrawingMode ? "点击地图不再进行绘画" : "点击地图开始自由绘画标记",
      duration: 2000
    });
  };

  // 选择颜色
  const selectColor = color => {
    setBrushColor(color);
    setShowColorPicker(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = color;
    }
  };

  // 切换方向标显示
  const toggleCompass = () => {
    setShowCompass(!showCompass);
    toast({
      title: showCompass ? "方向标已隐藏" : "方向标已显示",
      description: showCompass ? "方向标已从地图上移除" : "可以拖动方向标到任意位置",
      duration: 2000
    });
  };

  // 开始拖拽方向标 - 支持触摸设备
  const startDraggingCompass = e => {
    if (!showCompass) return;
    setIsDraggingCompass(true);
    const rect = containerRef.current.getBoundingClientRect();

    // 获取触摸点或鼠标点的坐标
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const offsetX = clientX - compassPosition.x;
    const offsetY = clientY - compassPosition.y;
    setDragStart({
      x: offsetX,
      y: offsetY
    });
    e.preventDefault();
  };

  // 拖拽方向标中 - 支持触摸设备
  const dragCompass = e => {
    if (!isDraggingCompass || !showCompass) return;

    // 获取触摸点或鼠标点的坐标
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const newX = clientX - dragStart.x;
    const newY = clientY - dragStart.y;

    // 限制在图片范围内 - 方向标尺寸改为200px后调整边界限制
    const maxX = imageSize.width - 200; // 从160px改为200px
    const maxY = imageSize.height - 200; // 从160px改为200px
    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));
    setCompassPosition({
      x: boundedX,
      y: boundedY
    });
    e.preventDefault();
  };

  // 结束拖拽方向标
  const endDraggingCompass = () => {
    setIsDraggingCompass(false);
  };

  // 获取鼠标事件处理函数
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

  // 重绘画布
  useEffect(() => {
    initCanvas();
  }, [lines, brushColor]);

  // 监听窗口大小变化，重新调整画布尺寸
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        const width = imageRef.current.offsetWidth;
        const height = imageRef.current.offsetHeight;
        setImageSize({
          width,
          height
        });
        const canvas = canvasRef.current;
        if (canvas) {
          // 保存当前线条状态
          const currentLines = [...lines];
          canvas.width = width;
          canvas.height = height;
          // 重新初始化画布并重绘线条
          initCanvas();
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [lines]);

  // 监听视频播放结束
  useEffect(() => {
    if (showVideo && videoRef.current) {
      const video = videoRef.current;
      const handleVideoEnd = () => {
        console.log('视频播放结束，准备跳转到第二关');
        setShowVideo(false);
        $w.utils.navigateTo({
          pageId: 'level2',
          params: {}
        });
      };
      video.addEventListener('ended', handleVideoEnd);
      return () => video.removeEventListener('ended', handleVideoEnd);
    }
  }, [showVideo, $w.utils]);

  // 检查视频是否加载成功
  useEffect(() => {
    if (showVideo && videoRef.current) {
      const video = videoRef.current;
      const handleCanPlay = () => {
        console.log('视频可以播放了');
        // 尝试自动播放
        video.play().catch(error => {
          console.error('自动播放失败:', error);
          toast({
            title: "请点击播放按钮",
            description: "浏览器限制需要手动点击播放视频",
            duration: 3000
          });
        });
      };
      const handleError = error => {
        console.error('视频加载错误:', error);
        toast({
          title: "视频加载失败",
          description: "无法播放视频，将直接进入第二关",
          variant: "destructive"
        });
        // 视频加载失败时直接跳转
        setTimeout(() => {
          setShowVideo(false);
          $w.utils.navigateTo({
            pageId: 'level2',
            params: {}
          });
        }, 2000);
      };
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [showVideo, $w.utils, toast]);

  // 添加全局拖拽事件监听
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
  const checkAnswer = async () => {
    if (!direction.trim() || !angle.trim() || !distance.trim()) {
      toast({
        title: "请填写完整",
        description: "请填写方位、角度和距离信息",
        variant: "destructive"
      });
      return;
    }

    // 构建完整答案
    const fullAnswer = `${direction.trim()}${angle.trim()}°${distance.trim()}米`;

    // 正确答案列表
    const correctAnswers = ['南偏西30°1000米', '南偏西30度1000米', '西偏南60°1000米', '西偏南60度1000米'];
    const isCorrect = correctAnswers.includes(fullAnswer);
    if (isCorrect) {
      setIsLoading(true);
      try {
        // 记录学生答题情况
        await $w.cloud.callDataSource({
          dataSourceName: 'student_game_answers',
          methodName: 'wedaCreateV2',
          params: {
            data: {
              studentId: `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              level: 'level1_question',
              answerContent: fullAnswer,
              submittedAt: Date.now(),
              isCorrect: true,
              animalType: '熊猫馆归还工具'
            }
          }
        });
        toast({
          title: "恭喜你！",
          description: "答对了！工具归还成功",
          duration: 3000
        });

        // 播放提示音
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
        audio.play();

        // 显示视频
        setShowVideo(true);
      } catch (error) {
        console.error('提交答案失败:', error);
        toast({
          title: "提交失败",
          description: "网络错误，请重试",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "再想想",
        description: "答案不正确，请重新观察图片",
        variant: "destructive"
      });
    }
  };
  return <>
      <VideoOverlay showVideo={showVideo} setShowVideo={setShowVideo} $w={$w} videoRef={videoRef} />
      
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-blue-800 text-center">
                工具归还任务 🛠️
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* 任务描述 */}
              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
                <h3 className="text-xl font-semibold text-blue-800 text-center mb-4">
                  请在熊猫馆返回营养中心归还工具。
                </h3>
                <p className="text-lg text-blue-600 text-center">
                  观察地图，判断营养中心在熊猫馆的什么位置
                </p>
              </div>

              {/* 熊猫馆图片和画布 */}
              <div className="text-center relative" ref={containerRef}>
                <img ref={imageRef} src="https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E7%86%8A%E7%8C%AB%E8%BF%98%E5%B7%A5%E5%85%B7.png?sign=0a8189570968861beb2133ed17209fa4&t=1760258029" alt="熊猫馆地图" className="mx-auto rounded-lg shadow-lg max-w-full h-auto mb-4 border-4 border-yellow-400" onLoad={() => {
                if (imageRef.current) {
                  const width = imageRef.current.offsetWidth;
                  const height = imageRef.current.offsetHeight;
                  setImageSize({
                    width,
                    height
                  });
                  const canvas = canvasRef.current;
                  if (canvas) {
                    // 保存当前线条状态
                    const currentLines = [...lines];
                    canvas.width = width;
                    canvas.height = height;
                    // 重新初始化画布并重绘线条
                    initCanvas();
                  }
                }
              }} />
                
                <canvas ref={canvasRef} className="absolute top-0 left-1/2 transform -translate-x-1/2 cursor-crosshair" style={{
                width: imageSize.width,
                height: imageSize.height,
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
                
                {/* 可移动方向标 - 修改图片URL为蓝色方向标 */}
                {showCompass && <img ref={compassRef} src="https://7374-studentsdata-5gvpf569db29cda3-1379552537.tcb.qcloud.la/%E6%96%B9%E5%90%91%E6%A0%87%E8%93%9D.png?sign=903aa6f1119d1542de259f84eb7dcc39&t=1760487465" alt="方向标" className="absolute cursor-move transition-transform duration-200 hover:scale-110 z-10" style={{
                left: compassPosition.x,
                top: compassPosition.y,
                width: '200px',
                height: '200px',
                opacity: isDraggingCompass ? 0.8 : 1,
                transform: isDraggingCompass ? 'scale(1.1)' : 'scale(1)'
              }} onMouseDown={startDraggingCompass} onTouchStart={startDraggingCompass} />}
                
                <p className="text-base text-gray-600">
                  {isFreeDrawingMode ? '✏️ 可以在图片上自由绘画标记' : isDrawingMode ? '📐 可以在图片上绘制辅助线' : showCompass ? '🧭 可以拖动方向标到任意位置' : '仔细观察图片中的方位和距离关系'}
                </p>
              </div>

              {/* 画图工具触发按钮 */}
              <div className="flex justify-center">
                <Button onClick={() => setShowDrawingTool(!showDrawingTool)} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-all duration-200 hover:scale-105 px-6">
                  {showDrawingTool ? '隐藏画图工具' : '显示画图工具'}
                </Button>
              </div>

              {/* 画图工具控制区域 */}
              {showDrawingTool && <DrawingTools isFreeDrawingMode={isFreeDrawingMode} isDrawingMode={isDrawingMode} showCompass={showCompass} showColorPicker={showColorPicker} brushColor={brushColor} colorOptions={colorOptions} toggleFreeDrawingMode={toggleFreeDrawingMode} toggleDrawingMode={toggleDrawingMode} toggleCompass={toggleCompass} setShowColorPicker={setShowColorPicker} selectColor={selectColor} clearCanvas={clearCanvas} />}

              {/* 答案输入区域 */}
              <AnswerInput direction={direction} setDirection={setDirection} angle={angle} setAngle={setAngle} distance={distance} setDistance={setDistance} />

              {/* 按钮区域 */}
              <div className="flex justify-center space-x-6">
                <Button onClick={checkAnswer} className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-lg" disabled={isLoading}>
                  {isLoading ? '验证中...' : '提交答案'}
                </Button>
                
                <Button variant="outline" onClick={() => $w.utils.navigateTo({
                pageId: 'index',
                params: {}
              })} className="border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-3 rounded-full px-8 text-base">
                  返回首页
                </Button>
              </div>

              {/* 成功提示 */}
              <div className="text-center">
                <p className="text-base text-gray-500">
                  答对后自动进入第二关喂食动物 🐾
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>;
}