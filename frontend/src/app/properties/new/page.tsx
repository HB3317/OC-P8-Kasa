import {redirect} from 'next/navigation';
import {getSessionUser} from '@/services/authService';
import NewPropertyTemplate from '@/components/templates/NewPropertyTemplate';
export default async function NewPropertyPage(){
 const user=await getSessionUser();
 if(!user)redirect('/login?next=%2Fproperties%2Fnew');
 return <NewPropertyTemplate user={user}/>;
}
