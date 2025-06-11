import { useParams } from 'react-router-dom';
import WebsiteComparisonTool from './tools/WebsiteComparisonTool';

const tools = {
  'website-comparison': { 
    component: WebsiteComparisonTool,
    title: "SEO Tool",
    description: "A sophisticated analysis of your website's performance against competitors you actually care about. Get actionable insights and recommendations."
  },
  'partnership-health': { 
    title: "Partnership Health Checker",
    description: "An honest evaluation of your current partnerships. Which ones are performing, which need attention, and which should be quietly retired."
  },
  'market-readiness': { 
    title: "Market Entry Readiness Assessment",
    description: "A discerning evaluation of your expansion readiness. Better to know now than discover later in expensive real-time."
  }
};

const ToolPage = () => {
  const { toolId } = useParams();
  const tool = tools[toolId];

  if (!tool) return <div className="p-10">Tool not found.</div>;

  // If the tool has a component, render it
  if (tool.component) {
    return <tool.component />;
  }

  // Otherwise, show the coming soon message
  return (
    <div className="w-full min-h-screen px-6 py-16 bg-white">
      <h1 className="text-4xl font-bold mb-6">{tool.title}</h1>
      <p className="text-lg mb-4">{tool.description}</p>
      <p className="text-sm text-gray-500">(Tool functionality coming soon...)</p>
    </div>
  );
};

export default ToolPage; 