import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { Control } from 'react-hook-form';
import { Briefcase, User } from 'lucide-react';
import { getChallengeById } from '../utils/challengeUtils';

const ProjectTypeSelector = ({ control, challengeId, companyName }) => {
  const [selectedType, setSelectedType] = useState(challengeId ? 'proposal' : 'personal');
  const [selectedChallenge, setSelectedChallenge] = useState(undefined);
  const [selectedChallengeId, setSelectedChallengeId] = useState(challengeId);

  useEffect(() => {
    if (challengeId) {
      const challenge = getChallengeById(challengeId);
      setSelectedChallenge(challenge);
    }
  }, [challengeId]);

  const handleChallengeSelect = (id) => {
    const challenge = getChallengeById(id);
    setSelectedChallenge(challenge);
    setSelectedChallengeId(id);
  };

  const availableChallenges = [
    {id: '1', name: 'GreenCity Technologies', challenge: 'Sustainable Urban Mobility Solutions'},
    {id: '2', name: 'AquaPure Inc.', challenge: 'Clean Water Access Technologies'},
    {id: '3', name: 'EduTech Foundation', challenge: 'Digital Literacy for Developing Nations'}
  ];

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="projectType"
        defaultValue={challengeId ? 'proposal' : 'personal'}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-lg font-semibold">Project Type</FormLabel>
            <FormDescription>
              Choose the type of project you want to create
            </FormDescription>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedType(value);
                }}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                <div>
                  <RadioGroupItem
                    value="personal"
                    id="personal"
                    className="sr-only peer"
                  />
                  <label
                    htmlFor="personal"
                    className={`
                      flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer
                      ${selectedType === 'personal' ? 'border-primary bg-primary/5' : 'border-muted hover:bg-muted/5'}
                    `}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Personal Project</CardTitle>
                    <CardDescription className="text-center mt-2">
                      Create your own independent project for funding
                    </CardDescription>
                  </label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="proposal"
                    id="proposal"
                    className="sr-only peer"
                  />
                  <label
                    htmlFor="proposal"
                    className={`
                      flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer
                      ${selectedType === 'proposal' ? 'border-primary bg-primary/5' : 'border-muted hover:bg-muted/5'}
                    `}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Company Proposal</CardTitle>
                    <CardDescription className="text-center mt-2">
                      Submit a proposal to a specific company challenge
                    </CardDescription>
                  </label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedType === 'proposal' && !selectedChallenge && (
        <Card>
          <CardHeader>
            <CardTitle>Company Proposal Details</CardTitle>
            <CardDescription>
              Select a company challenge to submit your proposal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={control}
              name="companyChallenge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Challenge</FormLabel>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {availableChallenges.map(company => (
                      <div 
                        key={company.id} 
                        className={`
                          flex items-center justify-between p-3 rounded-md border cursor-pointer
                          ${field.value === company.id ? 'border-primary bg-primary/5' : 'border-muted hover:bg-muted/5'}
                        `}
                        onClick={() => {
                          field.onChange(company.id);
                          handleChallengeSelect(company.id);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{company.name}</p>
                            <p className="text-sm text-muted-foreground">{company.challenge}</p>
                          </div>
                        </div>
                        <RadioGroupItem value={company.id} checked={field.value === company.id} />
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}
      
      {selectedType === 'proposal' && selectedChallenge && (
        <Card>
          <CardHeader>
            <CardTitle>Company Challenge: {selectedChallenge.title}</CardTitle>
            <CardDescription>
              Proposal for {selectedChallenge.company}'s challenge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedChallenge.logo}
                  alt={selectedChallenge.company}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{selectedChallenge.company}</p>
                  <p className="text-sm text-muted-foreground">Challenge ID: {selectedChallenge.id}</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-muted/30 rounded-md">
                <h4 className="font-medium mb-2">Challenge Description</h4>
                <p className="text-sm">{selectedChallenge.description}</p>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Award:</span>
                    <span className="font-medium">{selectedChallenge.award}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Deadline:</span>
                    <span className="font-medium">{selectedChallenge.deadline}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <span className="text-muted-foreground text-sm block mb-1">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedChallenge.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <FormField
                control={control}
                name="companyChallenge"
                defaultValue={selectedChallengeId}
                render={({ field }) => (
                  <input type="hidden" {...field} />
                )}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectTypeSelector;