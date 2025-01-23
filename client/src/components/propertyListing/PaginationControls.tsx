import { Button } from "../ui/button";
interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls = ({ currentPage, totalPages, onPageChange }: PaginationControlsProps) => {
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className="flex justify-center space-x-2 mt-4">
      <Button onClick={handlePrev} disabled={currentPage === 1}>
        Previous
      </Button>
      <span className="self-center">{`${currentPage} / ${totalPages}`}</span>
      <Button onClick={handleNext} disabled={currentPage === totalPages}>
        Next
      </Button>
    </div>
  );
};

export default PaginationControls;
