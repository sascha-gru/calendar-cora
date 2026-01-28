"use client"

import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(error);
    }
  }

  function handleTextareaChange(e: {target: { value: string }}) {
    setAnswer(e.target.value);
  }

  return (
    <div className='p-10 text-center bg-grey min-h-screen'>
      <div className='bg-white p-10 rounded-lg inline-block mt-10'>
      <h2 className='text-2xl font-bold mb-4'>City quiz</h2>
      <p className='text-lg'>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form className='mt-6' 
      onSubmit={handleSubmit}>
        <textarea className='p-2 rounded-md text-black border border-black' 
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button className='text-lg mt-4 cursor-pointer bg-black text-white px-6 py-2 rounded-md hover:bg-grey hover:text-black border border-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black hover:text-white'
        disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
      </div>
    </div>
  );
}

function submitForm(answer: string): Promise<void> { 
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}