import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft, Tag } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Priority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'Work',
  'Study',
  'Health',
  'Fitness',
  'Personal',
  'Habits',
  'Reading',
  'Other',
];

export function TaskForm() {
  const navigate = useNavigate();
  const { addTask } = useTaskContext();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    addTask({
      name: name.trim(),
      description: description.trim() || undefined,
      category: category || undefined,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      priority,
    });
    
    navigate('/');
  };

  const priorities: Priority[] = ['low', 'medium', 'high'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="p-6 rounded-2xl glass">
        <h2 className="text-2xl font-bold mb-6 gradient-text">Create New Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Task Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What do you want to accomplish?"
              className="bg-secondary/50 border-border/50 focus:border-primary"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Category / Subject
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(category === cat ? '' : cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm transition-all",
                    category === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details (optional)"
              className="bg-secondary/50 border-border/50 focus:border-primary resize-none"
              rows={3}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex-1 py-2.5 px-4 rounded-lg font-medium text-sm capitalize transition-all",
                    priority === p
                      ? p === 'low' 
                        ? "bg-muted text-foreground ring-2 ring-muted-foreground"
                        : p === 'medium'
                        ? "bg-warning/20 text-warning ring-2 ring-warning"
                        : "bg-destructive/20 text-destructive ring-2 ring-destructive"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date *</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-secondary/50 border-border/50"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, 'MMM d, yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-secondary/50 border-border/50"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'MMM d, yyyy') : 'No end date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < startDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Tasks repeat daily from start date until end date or until completed.
          </p>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-primary"
          >
            Create Task
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
