import { useParams } from 'react-router-dom';
import WebsiteComparisonTool from './tools/WebsiteComparisonTool';
import CompleteSeOAnalyzer from "./tools/WebsiteComparisonTool";
import ReferralManagementPortal from './tools/ReferralManagementPortal';
import IntegrationGuide from './tools/IntegrationGuide';

const tools = {
  'website-comparison': { 
    component: WebsiteComparisonTool,
    title: "Competitor Website Checker",
    description: "Compare your website to competitors instantly. Get actionable SEO and web performance insights."
  },
  'seo-analyser': {
    component: CompleteSeOAnalyzer,
    title: "Competitor Website Checker",
    description: "Compare your website to competitors instantly. Get actionable SEO and web performance insights."
  },
  'partnership-health': { 
    component: ReferralManagementPortal,
    title: "Referral Management Portal",
    description: "Take control of your B2B referral program with a real-time dashboard. Track every partner lead, measure deal velocity, and drive more revenue—no more spreadsheets."
  },
  'portal/integration-guide': {
    component: IntegrationGuide,
    title: "Integration Guide",
    description: "Step-by-step guide to integrate the Referral Management Portal into your existing website."
  },
  'gdpr-checker': {
    title: "GDPR Compliance Checker for Luxury Brands",
    description: "Specialized GDPR audit for luxury retailers. Ensure your high-end customer data practices meet EU regulations while maintaining premium brand experience."
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