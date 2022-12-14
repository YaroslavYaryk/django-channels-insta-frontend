export function formatMessageTimestamp(timestamp?: string) {
  if (!timestamp) return;
  const date = new Date(timestamp);
  // return date.toLocaleTimeString().slice(0, 12);
  var time = date.toLocaleTimeString().slice(0, 7).split(":");
  var betterTime = `${time[0]}:${time[1]} `;
  return (
    betterTime +
    date.toLocaleTimeString().slice(-3, date.toLocaleTimeString().length + 1)
  );
}
