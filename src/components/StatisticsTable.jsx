// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Input, useToast } from '@/components/ui';

export function StatisticsTable({
  dataSourceName,
  level,
  password,
  buttonText,
  buttonColor,
  borderColor,
  bgColor,
  $w
}) {
  const {
    toast
  } = useToast();
  const [showStats, setShowStats] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [statsPassword, setStatsPassword] = useState('');
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 计算不同答案的种类数量和分组
  const getAnswerGroups = () => {
    const answerGroups = {};
    answers.forEach(item => {
      if (item.answerContent) {
        const answer = item.answerContent.trim();
        if (!answerGroups[answer]) {
          answerGroups[answer] = {
            count: 0,
            latestTime: 0,
            answer: answer
          };
        }
        answerGroups[answer].count++;
        if (item.submittedAt > answerGroups[answer].latestTime) {
          answerGroups[answer].latestTime = item.submittedAt;
        }
      }
    });

    // 转换为数组并按数量降序排序
    return Object.values(answerGroups).sort((a, b) => b.count - a.count);
  };
  const getUniqueAnswerCount = () => {
    return getAnswerGroups().length;
  };
  const loadStatistics = async () => {
    setLoading(true);
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName,
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                level: {
                  $eq: level
                }
              }]
            }
          },
          select: {
            studentId: true,
            answerContent: true,
            submittedAt: true,
            animalType: true
          },
          orderBy: [{
            submittedAt: 'desc'
          }],
          pageSize: 100,
          pageNumber: 1
        }
      });
      setAnswers(result.records || []);
    } catch (error) {
      console.error(`加载统计失败:`, error);
      toast({
        title: "加载失败",
        description: "无法加载统计信息",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const checkStatsPassword = () => {
    if (statsPassword === password) {
      setShowStats(true);
      setShowPasswordInput(false);
      setStatsPassword('');
      loadStatistics();
      toast({
        title: "验证成功",
        description: "可以查看统计信息了",
        duration: 2000
      });
    } else {
      toast({
        title: "密码错误",
        description: "请输入正确的统计密码",
        variant: "destructive"
      });
    }
  };
  const hideStats = () => {
    setShowStats(false);
    setAnswers([]);
  };
  return <div className={`${bgColor} p-4 rounded-lg border ${borderColor}`}>
      {!showPasswordInput && !showStats && <Button onClick={() => setShowPasswordInput(true)} className={`w-full ${buttonColor} text-white font-medium`}>
          {buttonText}
        </Button>}
      
      {showPasswordInput && <div className="space-y-3">
          <Input value={statsPassword} onChange={e => setStatsPassword(e.target.value)} placeholder="输入密码" type="password" className="w-full bg-white" />
          <div className="flex space-x-2">
            <Button onClick={checkStatsPassword} className={`flex-1 ${buttonColor} text-white`}>
              确认
            </Button>
            <Button variant="outline" onClick={() => setShowPasswordInput(false)} className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50">
              取消
            </Button>
          </div>
        </div>}

      {showStats && <div>
          <div className="flex justify-between items-center mb-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700">
                统计结果（{answers.length}条记录）
              </h4>
              <p className="text-xs text-gray-500">
                共{getUniqueAnswerCount()}种不同答案
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={hideStats} className="text-xs text-gray-600 hover:text-gray-800">
              隐藏统计
            </Button>
          </div>
          
          {loading ? <div className="text-center py-4">
              <p className="text-sm text-gray-600">加载中...</p>
            </div> : answers.length > 0 ? <div className="space-y-2 max-h-48 overflow-y-auto">
              {getAnswerGroups().map((group, index) => <div key={index} className="flex items-center justify-between text-sm p-2 bg-white rounded border border-gray-200">
                  <div className="flex-1">
                    <span className="text-gray-700 font-medium">
                      {group.answer}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {group.count}次
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(group.latestTime).toLocaleTimeString()}
                    </span>
                  </div>
                </div>)}
            </div> : <p className="text-sm text-gray-500 text-center py-4">暂无记录</p>}
        </div>}
    </div>;
}