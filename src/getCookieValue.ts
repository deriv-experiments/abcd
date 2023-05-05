export default function getCookieValue (name: string): string | undefined {
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid cookie name provided');
  }

  const namePattern = /^[^;=\s]+$/;
  if (!namePattern.test(name)) {
    throw new Error('Invalid characters in cookie name');
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const decodedValue = decodeURIComponent(parts.pop()?.split(';').shift() ?? '');
    if (decodedValue) {
      return decodedValue;
    } else {
      throw new Error('Error decoding cookie value');
    }
  }
}
