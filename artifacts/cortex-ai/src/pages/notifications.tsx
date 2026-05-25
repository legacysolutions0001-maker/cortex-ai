import { useGetNotifications } from "@workspace/api-client-react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export default function Notifications() {
  const { data: notifications } = useGetNotifications();

  const getIcon = (type: string) => {
    switch(type) {
      case 'alert': return <AlertCircle className="w-5 h-5 text-destructive glow-destructive" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-warning glow-warning" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-success glow-success" />;
      default: return <Info className="w-5 h-5 text-primary glow-primary" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch(type) {
      case 'alert': return "border-destructive/30 hover:border-destructive";
      case 'warning': return "border-warning/30 hover:border-warning";
      case 'success': return "border-success/30 hover:border-success";
      default: return "border-primary/30 hover:border-primary";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="font-heading text-2xl tracking-widest text-foreground">SYSTEM ALERTS</h1>
      
      <div className="space-y-4">
        {notifications?.map(notif => (
          <div key={notif.id} className={`glass-panel p-4 rounded-xl flex items-start gap-4 border transition-colors ${getBorderColor(notif.type)}`}>
            <div className="mt-1">
              {getIcon(notif.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-heading text-lg">{notif.title}</h3>
                <span className="text-xs font-mono text-muted-foreground">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-muted-foreground">{notif.message}</p>
            </div>
            {!notif.read && (
              <div className="w-2 h-2 rounded-full bg-primary glow-primary self-center" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
