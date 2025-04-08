const RobotsTxt = () => (
    <pre className="bg-gray-100 p-4 rounded-md text-sm font-mono overflow-auto">
  {`User-agent: Googlebot
  Allow: /
  
  User-agent: Bingbot
  Allow: /
  
  User-agent: Twitterbot
  Allow: /
  
  User-agent: facebookexternalhit
  Allow: /
  
  User-agent: *
  Allow: /`}
    </pre>
  );
  
  export default RobotsTxt;
  
  