import INDEX from '../pages/index.jsx';
import LEVEL1 from '../pages/level1.jsx';
import LEVEL2 from '../pages/level2.jsx';
import LEVEL3 from '../pages/level3.jsx';
import TEACHER_DASHBOARD from '../pages/teacher_dashboard.jsx';
import PRE_CHALLENGE from '../pages/pre_challenge.jsx';
import LEVEL1_TO_LEVEL2 from '../pages/level1_to_level2.jsx';
import LEVEL1_QUESTION from '../pages/level1_question.jsx';
export const routers = [{
  id: "index",
  component: INDEX
}, {
  id: "level1",
  component: LEVEL1
}, {
  id: "level2",
  component: LEVEL2
}, {
  id: "level3",
  component: LEVEL3
}, {
  id: "teacher_dashboard",
  component: TEACHER_DASHBOARD
}, {
  id: "pre_challenge",
  component: PRE_CHALLENGE
}, {
  id: "level1_to_level2",
  component: LEVEL1_TO_LEVEL2
}, {
  id: "level1_question",
  component: LEVEL1_QUESTION
}]