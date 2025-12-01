import { useState } from "react";
import { BarChart, Users, MessageSquare, FileText, Plus, Edit, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./features/ui_features/card";
import { Button } from "./features/button";
import { Badge } from "./features/ui_features/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./features/ui_features/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./features/ui_features/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./features/ui_features/dialog";
import { Input } from "./features/input";
import { Textarea } from "./features/ui_features/textarea";
import { Label } from "./features/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./features/ui_features/select";
import { toast } from "sonner"
import React from "react";

interface User {
  name: string;
  email: string;
  role: 'student' | 'faculty'| 'admin';
}

interface FacultyDashboardProps {
  user: User;
}

export default function FacultyDashboard({ user }: FacultyDashboardProps) {
  const [newFAQ, setNewFAQ] = useState({
    question: '',
    answer: '',
    category: '',
    newCategory: ''
  });
  const [isAddingFAQ, setIsAddingFAQ] = useState(false);

  // Mock data for analytics
  const stats = {
    totalTickets: 156,
    activeChats: 12,
    resolvedToday: 23,
    avgResponseTime: '2.4 hours'
  };

  // Mock recent tickets
  const recentTickets = [
    { id: 'T001', student: 'John Doe', subject: 'Lab Access Issue', priority: 'high', status: 'open', created: '2 hours ago' },
    { id: 'T002', student: 'Jane Smith', subject: 'Prerequisites Question', priority: 'medium', status: 'in-progress', created: '4 hours ago' },
    { id: 'T003', student: 'Mike Johnson', subject: 'Graduation Requirements', priority: 'low', status: 'resolved', created: '1 day ago' },
    { id: 'T004', student: 'Sarah Wilson', subject: 'Course Registration', priority: 'medium', status: 'open', created: '1 day ago' },
    { id: 'T005', student: 'David Brown', subject: 'Internship Information', priority: 'low', status: 'resolved', created: '2 days ago' }
  ];

  // Mock FAQ management data
  const managedFAQs = [
    { id: '1', question: 'What are the prerequisites for CMSC 341?', category: 'Prerequisites', lastUpdated: '2 days ago' },
    { id: '2', question: 'How do I get lab access?', category: 'Technical Support', lastUpdated: '1 week ago' },
    { id: '3', question: 'When should I meet with my advisor?', category: 'Academic Advising', lastUpdated: '3 days ago' }
  ];

  const handleAddFAQ = () => {
    if (!newFAQ.question || !newFAQ.answer) {
      toast.error("Please fill in both question and answer");
      return;
    }

    const category = newFAQ.newCategory || newFAQ.category;
    if (!category) {
      toast.error("Please select or enter a category");
      return;
    }

    // Simulate adding FAQ
    toast.success("FAQ added successfully!");
    setNewFAQ({ question: '', answer: '', category: '', newCategory: '' });
    setIsAddingFAQ(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeChats}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolvedToday}</div>
            <p className="text-xs text-muted-foreground">+8% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">-15 min from last week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="faqs">FAQ Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.student}</TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.created}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">FAQ Management</h3>
            <Dialog open={isAddingFAQ} onOpenChange={setIsAddingFAQ}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New FAQ</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="question">Question</Label>
                    <Input
                      id="question"
                      value={newFAQ.question}
                      onChange={(e) => setNewFAQ(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="Enter the question..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="answer">Answer</Label>
                    <Textarea
                      id="answer"
                      value={newFAQ.answer}
                      onChange={(e) => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))}
                      placeholder="Enter the detailed answer..."
                      rows={6}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Existing Category</Label>
                      <Select 
                        value={newFAQ.category} 
                        onValueChange={(value) => setNewFAQ(prev => ({ ...prev, category: value, newCategory: '' }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Prerequisites">Prerequisites</SelectItem>
                          <SelectItem value="Academic Advising">Academic Advising</SelectItem>
                          <SelectItem value="Technical Support">Technical Support</SelectItem>
                          <SelectItem value="Registration">Registration</SelectItem>
                          <SelectItem value="Career Services">Career Services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newCategory">Or New Category</Label>
                      <Input
                        id="newCategory"
                        value={newFAQ.newCategory}
                        onChange={(e) => setNewFAQ(prev => ({ ...prev, newCategory: e.target.value, category: '' }))}
                        placeholder="Create new category..."
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingFAQ(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddFAQ} className="bg-primary hover:bg-primary/90">
                      Add FAQ
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {managedFAQs.map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell className="font-medium">{faq.question}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{faq.category}</Badge>
                      </TableCell>
                      <TableCell>{faq.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular FAQ Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Prerequisites</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded">
                        <div className="w-3/4 h-2 bg-primary rounded"></div>
                      </div>
                      <span className="text-sm text-gray-600">75%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Technical Support</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded">
                        <div className="w-3/5 h-2 bg-primary rounded"></div>
                      </div>
                      <span className="text-sm text-gray-600">60%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Academic Advising</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded">
                        <div className="w-2/5 h-2 bg-primary rounded"></div>
                      </div>
                      <span className="text-sm text-gray-600">40%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Average Response</span>
                    <span className="font-medium">2.4 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fastest Response</span>
                    <span className="font-medium">15 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolution Rate</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Student Satisfaction</span>
                    <span className="font-medium">4.7/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}