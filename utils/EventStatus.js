exports.mapCoinbaseEventToStatus = (eventType) => {
  switch (eventType) {
    case 'charge:created':
      return 'CREATED'; // charge initiated
    case 'charge:pending':
      return 'PENDING'; // payment detected but not confirmed
    case 'charge:confirmed':
      return 'CONFIRMED'; // confirmed on blockchain
    case 'charge:completed':
      return 'COMPLETED'; // fully paid & confirmed
    case 'charge:delayed':
      return 'DELAYED'; // pending for long time
    case 'charge:unresolved':
      return 'UNRESOLVED'; // received but unexpected (e.g., underpaid)
    case 'charge:resolved':
      return 'RESOLVED'; // delayed/unresolved issue resolved
    case 'charge:failed':
      return 'FAILED'; // payment failed
    case 'charge:expired':
      return 'EXPIRED'; // no payment in time window
    case 'charge:updated':
      return 'UPDATED'; // metadata or minor update
    default:
      return 'UNKNOWN';
  }
};