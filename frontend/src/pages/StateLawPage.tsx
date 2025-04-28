import React from "react";

interface TabProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Tabs: React.FC<TabProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-4 px-1 border-b-2 font-medium text-md ${
              activeTab === tab
                ? "border-gray-800 text-gray-800 "
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

// Example usage
const Demo = () => {
  const [active, setActive] = React.useState("Georgia");
  const tabList = ["Georgia", "Tennessee", "Virginia"];

  return (
    <div className="w-full  mx-auto p-4 m-10 max-w-7xl">
      <Tabs tabs={tabList} activeTab={active} onTabChange={setActive} />
      <div className="mt-4">
        {active === "Georgia" && (
          <div>
            <h1 className="text-2xl">Georgia</h1>
            <div>
              <ul className="list-disc">
                <li>Judicial Foreclosure: Yes</li>
                <li>
                  Non-judicial Foreclosure: Yes (Primary). The lender can
                  foreclosure without court involvement if "power of sale"
                  clause exists in the mortgage or deed of trust.
                </li>
                <li>Right of Redemption Post-Auction: No</li>
                <li>Payment at Auction: Full apyment due at auction.</li>
                <li>
                  Date of Sale: The first Tuesday of the month between 10:00 am
                  and 4:00 pm at the county courthouse.
                </li>
              </ul>
            </div>
          </div>
        )}
        {active === "Tennessee" && (
          <div>
            {" "}
            <h1 className="text-2xl">Tennessee</h1>
            <div>
              <ul className="list-disc">
                <li>Judicial Foreclosure: Yes</li>
                <li>
                  Non-judicial Foreclosure: Yes (Primary). The lender can
                  foreclosure without court involvement if "power of sale"
                  clause exists in the mortgage or deed of trust.
                </li>
                <li>
                  Right of Redemption Post-Auction: Yes the borrower has two
                  years from the date of the auction to redeem the propert
                  unless the deed of trust / mortgage expressly walves the
                  right.
                </li>
                <li>Payment at Auction: Full apyment due at auction.</li>
                <li>
                  Date of Sale: On any business day between 10:00 am to 5:00 pm
                  at county aourthouse public space.
                </li>
              </ul>
            </div>
          </div>
        )}
        {active === "Virginia" && (
          <div>
            <h1 className="text-2xl">Virginia</h1>
            <div>
              <ul className="list-disc">
                <li>Judicial Foreclosure: Yes</li>
                <li>
                  Non-judicial Foreclosure: Yes (Primary). The lender can
                  foreclosure without court involvement if "power of sale"
                  clause exists in the mortgage or deed of trust.
                </li>
                <li>
                  Right of Redemption Post-Auction: For judicial foreclosure, a
                  judge may allow a post-foreclosure redemption period on
                  cause-by-cause basis. no right of redemption for non-judicial
                  foreclosures.
                </li>
                <li>
                  Payment at Auction: up to 10% deposit due at auction specified
                  before auction. This deposit must be submitted before the
                  auction of the property begins. The remaining balance is due
                  within 30 days.
                </li>
                <li>
                  Date of Sale: On any business day between 9:00 am to 5:00 pm
                  at country aourthouse public space.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Demo;
