export default async function (path, method) {
   const res = await fetch(`/api${path}`, {
      method,
      headers: {
         "Content-Type": "application/json",
      },
   });
   if (!res.ok) {
      const message = await res.json();
      throw new Error(message.message);
   }
   return res.json(); 
}