let retries = 2

if (process.env.NODE_ENV !== 'production') retries = 9999

export default retries
