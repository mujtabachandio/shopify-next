import { redirect } from 'next/navigation';

export default function RedirectPage() {
  // You can customize the redirect destination
  redirect('/collections');
  
  // This part won't be rendered due to the redirect
  return null;
}










 






