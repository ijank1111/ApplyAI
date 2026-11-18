export const statuses = ['Interested', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'] as const;
export type Status = typeof statuses[number];
export type Application = { id: string; company: string; role: string; location: string; salary: string; status: Status; description: string; notes: string; created: string; history: { date: string; text: string }[] };
export type Event = { id: string; title: string; applicationId: string; date: string; type: 'Interview' | 'Deadline' | 'Reminder' };
export type Workspace = { name: string; applications: Application[]; events: Event[] };
export const emptyWorkspace: Workspace = { name: 'Alex', applications: [], events: [] };
export const storageKey = 'applyai-workspace-v1';
export function sampleData(): Pick<Workspace, 'applications' | 'events'> {
  const entries: [string,string,string,string,Status][] = [
    ['Notion','Product Designer','San Francisco · Hybrid','$140k – $180k','Interview'],
    ['Linear','Senior Product Designer','Remote','$150k – $190k','Applied'],
    ['Spotify','UX Designer','New York · Hybrid','$125k – $165k','Assessment'],
    ['Figma','Product Designer','San Francisco · Hybrid','$145k – $185k','Interested'],
    ['Airbnb','Experience Designer','Remote','$135k – $175k','Applied'],
    ['Stripe','Product Designer, Payments','San Francisco','$150k – $200k','Offer'],
    ['Headspace','Visual Designer','Remote','$100k – $140k','Rejected'],
    ['Webflow','Senior UX Designer','Remote','$140k – $180k','Interested'],
  ];
  const applications = entries.map(([company,role,location,salary,status],i) => {
    const created = new Date(Date.now() - (i + 2) * 86400000).toISOString();
    return { id: crypto.randomUUID(), company, role, location, salary, status, description: `Join ${company} to build thoughtful digital experiences. Collaborate with product managers and engineers, conduct user research, and create accessible prototypes in Figma.`, notes: '', created, history: [{date: created, text: `Sample application added as ${status}`} ] };
  });
  const events: Event[] = [ {id:crypto.randomUUID(),title:'Portfolio review with Notion', applicationId:applications[0].id,date:new Date(Date.now()+86400000).toISOString().slice(0,16),type:'Interview'}, {id:crypto.randomUUID(),title:'Submit Spotify design assessment',applicationId:applications[2].id,date:new Date(Date.now()+3*86400000).toISOString().slice(0,16),type:'Deadline'}, {id:crypto.randomUUID(),title:'Follow up with Linear',applicationId:applications[1].id,date:new Date(Date.now()+5*86400000).toISOString().slice(0,16),type:'Reminder'} ];
  return {applications, events};
}
export function loadWorkspace(): Workspace {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return emptyWorkspace;
  const data = JSON.parse(raw);
  if (typeof data.name !== 'string' || !Array.isArray(data.applications) || !Array.isArray(data.events) || data.applications.some((a: Application) => !a.id || !a.company || !a.role || !statuses.includes(a.status) || !Array.isArray(a.history))) throw new Error('Saved workspace could not be read. Your existing browser data has not been overwritten.');
  return data;
}
