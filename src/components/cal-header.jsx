export default function CalHeader({ weekNumber, year, dateRange }) {
  return (
    <header className="cal-header">
      <h2>Week {weekNumber}, {year}</h2>
      <p>{dateRange}</p>
    </header>
  );
}
