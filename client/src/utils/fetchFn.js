export default async function (path, method) {
   const res = await fetch(`/api${path}`, {
      method,
      headers: {
         "Content-Type": "application/json",
      },
   });
   return res.json(); 
}