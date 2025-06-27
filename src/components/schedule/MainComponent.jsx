'use client';
import CalHeader from '@/components/cal-header.jsx';
import BinBin from '@/components/bin-bin.jsx';
import CalFooter from '@/components/cal-footer.jsx';

export default function MainComponent(props) {
  if (props.error) return <div className="error">{props.error}</div>;
  if (props.isLoading) return <div>Loading...</div>;

  return (
    <div className="schedule-app">
      <CalHeader {...props} />
      <BinBin 
        operators={props.initialOperators} 
        scheduleData={props.initialData} 
      />
      <CalFooter />
    </div>
  );
}
