app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Express JWT Backend Service is running!' 
  });
});