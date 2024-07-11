import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const foodItems = [
  'apple', 'banana', 'orange', 'broccoli', 'carrot', 'tomato', 'milk', 'cheese', 'yogurt', 
  'butter', 'cream', 'ice cream', 'egg', 'bread', 'pasta', 'rice', 'chicken', 'beef', 'pork', 
  'fish', 'shrimp', 'mushroom', 'potato', 'lettuce', 'cucumber', 'spinach', 'grape', 'lemon',
  'lime', 'strawberry', 'blueberry', 'raspberry', 'watermelon', 'melon', 'pineapple', 'mango',
  'kiwi', 'avocado', 'peach', 'plum', 'pear', 'cherry', 'corn', 'bean', 'pea', 'lentil', 
  'chickpea', 'nut', 'almond', 'walnut', 'peanut', 'cashew', 'hazelnut', 'bread', 'croissant', 
  'baguette', 'roll', 'cookie', 'cake', 'pie', 'pastry', 'brownie', 'chocolate', 'candy', 
  'sugar', 'honey', 'jam', 'jelly', 'maple syrup', 'syrup', 'oil', 'olive oil', 'coconut oil', 
  'butter', 'margarine', 'mayonnaise', 'ketchup', 'mustard', 'hot sauce', 'soy sauce', 'vinegar', 
  'soup', 'stew', 'cereal', 'oatmeal', 'granola', 'pancake', 'waffle', 'biscuit', 'scone', 'pizza', 
  'burger', 'sandwich', 'wrap', 'sushi', 'noodle', 'taco', 'burrito', 'quesadilla', 'salad', 
  'smoothie', 'shake', 'coffee', 'tea', 'milkshake', 'juice', 'soda', 'water', 'beer', 'wine', 
  'whiskey', 'vodka', 'rum', 'gin', 'tequila', 'cocktail', 'liqueur'
];

const App = () => {
  const webcamRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    detectObjects(imageSrc);
  }, [webcamRef]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        detectObjects(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const filterFoodItems = (detectedItems) => {
    return detectedItems.filter(item => foodItems.includes(item));
  };

  const detectObjects = async (imageSrc) => {
    setLoading(true);
    const img = new Image();
    img.src = imageSrc;
    img.onload = async () => {
      const model = await cocoSsd.load();
      const predictions = await model.detect(img);

      const detectedProducts = predictions.map(prediction => prediction.class);
      console.log('Detected Products:', detectedProducts); // Log detected products
      const filteredProducts = filterFoodItems(detectedProducts);
      setProducts(filteredProducts);
      setLoading(false);
    };
  };

  return (
    <div>
      <h1>Fridge Scanner</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        height={480}
      />
      <button onClick={capture}>Capture photo</button>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      {loading && (
        <div className="loader-container">
          <div className="bg-red-500"></div>
        </div>
      )}
      <div>
        <h2>Detected Products:</h2>
        <ul>
          {products.map((product, index) => (
            <li key={index}>{product}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
