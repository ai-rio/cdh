'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useMissionModal } from '../hooks/useMissionModal';
import { X, CheckCircle } from 'lucide-react';

export default function MissionBriefingModal() {
  const { isOpen, currentMission, currentView, closeModal, setView } = useMissionModal();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dossierLink: '',
    statement: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView('success');
  };

  const handleClose = () => {
    closeModal();
    // Reset form data
    setFormData({
      name: '',
      email: '',
      dossierLink: '',
      statement: ''
    });
  };

  const renderBriefingView = () => (
    <div className="modal-view">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-3xl font-bold text-white">{currentMission?.title}</h2>
          <p className="text-gray-400">{currentMission?.location}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="p-2 text-gray-500 hover:text-white"
          aria-label="Close briefing"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div 
        className="text-gray-300 briefing-body"
        dangerouslySetInnerHTML={{ __html: currentMission?.briefing || '' }}
      />
      <Button 
        onClick={() => setView('apply')}
        className="mt-8 w-full bg-lime-400 text-lime-900 font-bold hover:bg-lime-300"
      >
        Apply for Mission
      </Button>
    </div>
  );

  const renderApplyView = () => (
    <div className="modal-view">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-3xl font-bold text-white">Transmit Dossier</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="p-2 text-gray-500 hover:text-white"
          aria-label="Close form"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="sr-only">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="form-input w-full p-3 rounded-lg text-white bg-white/5 border-white/10 focus:border-lime-400 focus:ring-lime-400/30"
          />
        </div>
        <div>
          <Label htmlFor="email" className="sr-only">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="form-input w-full p-3 rounded-lg text-white bg-white/5 border-white/10 focus:border-lime-400 focus:ring-lime-400/30"
          />
        </div>
        <div>
          <Label htmlFor="dossier-link" className="sr-only">Dossier Link</Label>
          <Input
            id="dossier-link"
            type="url"
            placeholder="Portfolio / GitHub / LinkedIn"
            required
            value={formData.dossierLink}
            onChange={(e) => setFormData(prev => ({ ...prev, dossierLink: e.target.value }))}
            className="form-input w-full p-3 rounded-lg text-white bg-white/5 border-white/10 focus:border-lime-400 focus:ring-lime-400/30"
          />
        </div>
        <div>
          <Label htmlFor="statement" className="text-gray-400 mb-2 block">
            Briefing: In 1-2 paragraphs, describe the boundary you are most proud of breaking.
          </Label>
          <Textarea
            id="statement"
            rows={4}
            required
            value={formData.statement}
            onChange={(e) => setFormData(prev => ({ ...prev, statement: e.target.value }))}
            className="form-input w-full p-3 rounded-lg text-white bg-white/5 border-white/10 focus:border-lime-400 focus:ring-lime-400/30"
          />
        </div>
        <Button 
          type="submit"
          className="w-full bg-lime-400 text-lime-900 font-bold hover:bg-lime-300"
        >
          Transmit Dossier
        </Button>
      </form>
    </div>
  );

  const renderSuccessView = () => (
    <div className="modal-view text-center p-8">
      <CheckCircle className="w-16 h-16 mx-auto text-[#EEFC97]" />
      <h2 className="text-3xl font-bold text-white mt-4 mb-2">Transmission Received.</h2>
      <p className="text-gray-300">We are reviewing your dossier. Stand by for potential contact.</p>
      <Button 
        onClick={handleClose}
        variant="link"
        className="mt-8 text-sm text-gray-400 hover:text-white underline"
      >
        Close Window
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="briefing-content max-h-[90vh] overflow-y-auto bg-black/70 backdrop-blur-[25px] border-white/10 rounded-3xl p-8 w-[90%] max-w-[640px]">
        {currentView === 'briefing' && renderBriefingView()}
        {currentView === 'apply' && renderApplyView()}
        {currentView === 'success' && renderSuccessView()}
      </DialogContent>
    </Dialog>
  );
}