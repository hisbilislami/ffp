import { createContext, ReactNode, useContext, useState } from "react";
import { ListTransaction } from "./details/columns";

type BudgetTrackerContextType = {
  selectedData: ListTransaction | null;
  setSelectedData: (data: ListTransaction | null) => void;
};

const BudgetTrackerContext = createContext<
  BudgetTrackerContextType | undefined
>(undefined);

export const BudgetTrackerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedData, setSelectedData] = useState<ListTransaction | null>(
    null
  );

  return (
    <BudgetTrackerContext.Provider value={{ selectedData, setSelectedData }}>
      {children}
    </BudgetTrackerContext.Provider>
  );
};

export const useBudgetTracker = () => {
  const context = useContext(BudgetTrackerContext);
  if (!context) {
    throw new Error(
      "useBudgetTracker must be used inside BudgetTrackerProvider"
    );
  }

  return context;
};
