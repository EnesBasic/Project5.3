import CalHeader from '@/components/CalHeader';
import BinBin from '@/components/bin-bin/BinBin'; // Example component
import CalFooter from '@/components/CalFooter';

export default function Home() {
  return (
    <main className="app-container">
      <CalHeader />
      <div className="main-content">
        <BinBin />  {/* Your main calendar/schedule component */}
        {/* Add other components here */}
      </div>
      <CalFooter />
    </main>
  );
}