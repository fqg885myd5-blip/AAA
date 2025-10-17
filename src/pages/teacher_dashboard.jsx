// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast } from '@/components/ui';

export default function TeacherDashboard(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [answers, setAnswers] = useState([]);
  const [completionStats, setCompletionStats] = useState({});
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // 加载答案数据
  const loadAnswers = async () => {
    setIsLoading(true);
    try {
      let filter = {};
      if (selectedLevel !== 'all') {
        filter.where = {
          $and: [{
            level: {
              $eq: selectedLevel
            }
          }]
        };
      }
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'student_game_answers',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: filter,
          select: {
            studentId: true,
            level: true,
            answerContent: true,
            submittedAt: true,
            isCorrect: true,
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
      console.error('加载答案数据失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载答案数据",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 加载完成统计
  const loadCompletionStats = async () => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'student_completion_status',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                isCompleted: {
                  $eq: true
                }
              }]
            }
          },
          select: {
            level: true,
            classId: true,
            animalType: true
          },
          getCount: true,
          pageSize: 1000,
          pageNumber: 1
        }
      });

      // 按关卡和班级统计
      const stats = {
        level1: {
          total: 0,
          byClass: {}
        },
        level2: {
          total: 0,
          byClass: {}
        },
        level3: {
          total: 0,
          byClass: {}
        }
      };
      result.records.forEach(record => {
        if (stats[record.level]) {
          stats[record.level].total++;
          if (!stats[record.level].byClass[record.classId]) {
            stats[record.level].byClass[record.classId] = 0;
          }
          stats[record.level].byClass[record.classId]++;
        }
      });
      setCompletionStats(stats);
    } catch (error) {
      console.error('加载统计失败:', error);
    }
  };

  // 重置所有数据
  const resetAllData = async () => {
    try {
      // 重置答案数据
      await $w.cloud.callDataSource({
        dataSourceName: 'student_game_answers',
        methodName: 'wedaBatchDeleteV2',
        params: {
          filter: {
            where: {}
          }
        }
      });

      // 重置完成状态数据
      await $w.cloud.callDataSource({
        dataSourceName: 'student_completion_status',
        methodName: 'wedaBatchDeleteV2',
        params: {
          filter: {
            where: {}
          }
        }
      });
      toast({
        title: "重置成功",
        description: "所有数据已重置",
        duration: 2000
      });

      // 重新加载数据
      await loadAnswers();
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

  // 组件加载时获取数据
  useEffect(() => {
    loadAnswers();
    loadCompletionStats();
  }, [selectedLevel, selectedClass]);
  return <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 标题和操作区 */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">教师管理面板</h1>
          <Button variant="outline" onClick={resetAllData} className="bg-red-100 text-red-700 hover:bg-red-200">
            重置所有数据
          </Button>
        </div>

        {/* 统计概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">第一关完成</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{completionStats.level1?.total || 0}</div>
              <p className="text-sm text-gray-500">学生完成人数</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">第二关完成</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{completionStats.level2?.total || 0}</div>
              <p className="text-sm text-gray-500">学生完成人数</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">第三关完成</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{completionStats.level3?.total || 0}</div>
              <p className="text-sm text-gray-500">学生完成人数</p>
            </CardContent>
          </Card>
        </div>

        {/* 筛选区域 */}
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">选择关卡</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="所有关卡" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有关卡</SelectItem>
                    <SelectItem value="level1">第一关</SelectItem>
                    <SelectItem value="level2">第二关</SelectItem>
                    <SelectItem value="level3">第三关</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">选择班级</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="所有班级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有班级</SelectItem>
                    <SelectItem value="class_1">一班</SelectItem>
                    <SelectItem value="class_2">二班</SelectItem>
                    <SelectItem value="class_3">三班</SelectItem>
                    <SelectItem value="class_4">四班</SelectItem>
                    <SelectItem value="class_5">五班</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="self-end">
                <Button onClick={loadAnswers} disabled={isLoading}>
                  {isLoading ? '加载中...' : '刷新数据'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 答案数据表格 */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>学生答案记录</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>关卡</TableHead>
                  <TableHead>学生ID</TableHead>
                  <TableHead>答案内容</TableHead>
                  <TableHead>是否正确</TableHead>
                  <TableHead>动物类型</TableHead>
                  <TableHead>提交时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {answers.length > 0 ? answers.map((answer, index) => <TableRow key={index}>
                      <TableCell className="font-medium">{answer.level}</TableCell>
                      <TableCell className="text-sm text-gray-500">{answer.studentId?.substring(0, 8)}...</TableCell>
                      <TableCell>{answer.answerContent}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${answer.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {answer.isCorrect ? '正确' : '错误'}
                        </span>
                      </TableCell>
                      <TableCell>{answer.animalType}</TableCell>
                      <TableCell>
                        {answer.submittedAt ? new Date(answer.submittedAt).toLocaleString() : '-'}
                      </TableCell>
                    </TableRow>) : <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {isLoading ? '加载中...' : '暂无数据'}
                    </TableCell>
                  </TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 班级统计表格 */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>班级完成统计</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>关卡</TableHead>
                  <TableHead>班级</TableHead>
                  <TableHead>完成人数</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(completionStats).map(([level, data]) => Object.entries(data.byClass || {}).map(([classId, count]) => <TableRow key={`${level}-${classId}`}>
                      <TableCell className="font-medium">{level}</TableCell>
                      <TableCell>{classId.replace('class_', '')}班</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>))}
                {Object.keys(completionStats).length === 0 && <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      暂无统计数据
                    </TableCell>
                  </TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>;
}