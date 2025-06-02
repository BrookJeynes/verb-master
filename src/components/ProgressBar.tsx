function ProgressBar({ progress }: { progress: number }) {
  const fillerStyles = {
    width: `${progress}%`,
  };

  return (
    <div className="h-6 w-full rounded-md border border-platinum bg-lightgray shadow-sm">
      <div className="h-full rounded-md bg-blue" style={fillerStyles} />
    </div>
  );
}

export default ProgressBar;
