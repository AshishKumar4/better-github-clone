import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
const commitSchema = z.object({
  message: z.string().min(1, 'Commit message is required'),
});
type CommitFormValues = z.infer<typeof commitSchema>;
interface CommitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CommitFormValues) => void;
  isSubmitting: boolean;
}
export function CommitDialog({ open, onOpenChange, onSubmit, isSubmitting }: CommitDialogProps) {
  const form = useForm<CommitFormValues>({
    resolver: zodResolver(commitSchema),
    defaultValues: {
      message: '',
    },
  });
  const handleFormSubmit = (values: CommitFormValues) => {
    onSubmit(values);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Commit Changes</DialogTitle>
          <DialogDescription>Enter a commit message for your changes.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commit Message</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Fix typo in README" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Committing...' : 'Commit Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}