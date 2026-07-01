import Root from './Root';
import Background from './Background';
import Foreground from './Foreground';
import Visual from './Visual';
import Step from './Step';

import { useFlowContext } from './Root';

const Flow = () => {
	throw new Error('The Flow parent component is <Flow.Root>');
};

Flow.Root = Root;
Flow.Background = Background;
Flow.Foreground = Foreground;
Flow.Visual = Visual;
Flow.Step = Step;
Flow.useFlowContext = useFlowContext;

export { Flow, Flow as default };
