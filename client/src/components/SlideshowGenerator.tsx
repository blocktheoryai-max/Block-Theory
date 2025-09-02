import { useState } from 'react';
import { Plus, Trash2, Eye, Save, Upload, Download, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Slide {
  id: number;
  title: string;
  content: string;
  keyPoints: string[];
  visualType: 'diagram' | 'chart' | 'list' | 'comparison';
  icon?: string;
}

interface SlideshowData {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  slides: Slide[];
  estimatedDuration: number;
  tags: string[];
  isPublic: boolean;
  isPremium: boolean;
  requiredTier: string;
}

const categories = [
  'Fundamentals',
  'Technical Analysis', 
  'DeFi',
  'NFTs',
  'Trading Psychology'
];

const difficulties = ['Beginner', 'Intermediate', 'Expert'];
const tiers = ['free', 'basic', 'pro', 'elite'];
const visualTypes = [
  { value: 'list', label: 'Bullet List', icon: '📝' },
  { value: 'diagram', label: 'Process Flow', icon: '🔄' },
  { value: 'chart', label: 'Data Grid', icon: '📊' },
  { value: 'comparison', label: 'Pros vs Cons', icon: '⚖️' }
];

export function SlideshowGenerator() {
  const [slideshowData, setSlideshowData] = useState<SlideshowData>({
    title: '',
    description: '',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    slides: [],
    estimatedDuration: 10,
    tags: [],
    isPublic: false,
    isPremium: false,
    requiredTier: 'free'
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createSlideshowMutation = useMutation({
    mutationFn: (data: SlideshowData) => apiRequest('POST', '/api/slideshows', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/slideshows'] });
      toast({
        title: "Slideshow Created",
        description: "Your interactive slideshow has been created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create slideshow. Please try again.",
        variant: "destructive",
      });
    }
  });

  const addSlide = () => {
    const newSlide: Slide = {
      id: slideshowData.slides.length,
      title: `Slide ${slideshowData.slides.length + 1}`,
      content: '',
      keyPoints: [''],
      visualType: 'list',
      icon: '💡'
    };
    setSlideshowData(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide]
    }));
  };

  const updateSlide = (index: number, updates: Partial<Slide>) => {
    setSlideshowData(prev => ({
      ...prev,
      slides: prev.slides.map((slide, i) => 
        i === index ? { ...slide, ...updates } : slide
      )
    }));
  };

  const deleteSlide = (index: number) => {
    setSlideshowData(prev => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index)
    }));
    if (currentSlide >= slideshowData.slides.length - 1) {
      setCurrentSlide(Math.max(0, slideshowData.slides.length - 2));
    }
  };

  const addKeyPoint = (slideIndex: number) => {
    updateSlide(slideIndex, {
      keyPoints: [...slideshowData.slides[slideIndex].keyPoints, '']
    });
  };

  const updateKeyPoint = (slideIndex: number, pointIndex: number, value: string) => {
    const newKeyPoints = [...slideshowData.slides[slideIndex].keyPoints];
    newKeyPoints[pointIndex] = value;
    updateSlide(slideIndex, { keyPoints: newKeyPoints });
  };

  const removeKeyPoint = (slideIndex: number, pointIndex: number) => {
    const newKeyPoints = slideshowData.slides[slideIndex].keyPoints.filter((_, i) => i !== pointIndex);
    updateSlide(slideIndex, { keyPoints: newKeyPoints });
  };

  const addTag = () => {
    if (newTag.trim() && !slideshowData.tags.includes(newTag.trim())) {
      setSlideshowData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSlideshowData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = () => {
    if (!slideshowData.title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter a title for your slideshow.",
        variant: "destructive",
      });
      return;
    }

    if (slideshowData.slides.length === 0) {
      toast({
        title: "No Slides",
        description: "Please add at least one slide to your slideshow.",
        variant: "destructive",
      });
      return;
    }

    createSlideshowMutation.mutate(slideshowData);
  };

  const generateFromAI = async () => {
    if (!slideshowData.title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter a title to generate slides with AI.",
        variant: "destructive",
      });
      return;
    }

    // This would integrate with OpenAI to generate slides based on the title and category
    toast({
      title: "AI Generation",
      description: "AI slide generation coming soon! For now, add slides manually.",
    });
  };

  const renderSlideEditor = (slide: Slide, index: number) => (
    <Card key={index} className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Slide {index + 1}</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => deleteSlide(index)}
          data-testid={`delete-slide-${index}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`slide-title-${index}`}>Title</Label>
          <Input
            id={`slide-title-${index}`}
            value={slide.title}
            onChange={(e) => updateSlide(index, { title: e.target.value })}
            placeholder="Enter slide title"
            data-testid={`input-slide-title-${index}`}
          />
        </div>

        <div>
          <Label htmlFor={`slide-content-${index}`}>Content</Label>
          <Textarea
            id={`slide-content-${index}`}
            value={slide.content}
            onChange={(e) => updateSlide(index, { content: e.target.value })}
            placeholder="Enter slide content"
            rows={3}
            data-testid={`textarea-slide-content-${index}`}
          />
        </div>

        <div>
          <Label>Visual Type</Label>
          <Select
            value={slide.visualType}
            onValueChange={(value: any) => updateSlide(index, { visualType: value })}
          >
            <SelectTrigger data-testid={`select-visual-type-${index}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {visualTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Key Points</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addKeyPoint(index)}
              data-testid={`add-keypoint-${index}`}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {slide.keyPoints.map((point, pointIndex) => (
            <div key={pointIndex} className="flex gap-2 mb-2">
              <Input
                value={point}
                onChange={(e) => updateKeyPoint(index, pointIndex, e.target.value)}
                placeholder="Enter key point"
                data-testid={`input-keypoint-${index}-${pointIndex}`}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeKeyPoint(index, pointIndex)}
                data-testid={`remove-keypoint-${index}-${pointIndex}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderSlidePreview = (slide: Slide) => {
    const progress = ((currentSlide + 1) / slideshowData.slides.length) * 100;

    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 min-h-96">
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>Slide {currentSlide + 1} of {slideshowData.slides.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">{slide.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{slide.content}</p>
        </div>

        <div className="space-y-4">
          {slide.visualType === 'list' && (
            <ul className="space-y-2">
              {slide.keyPoints.filter(Boolean).map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}

          {slide.visualType === 'comparison' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">Advantages</h4>
                <ul className="space-y-2">
                  {slide.keyPoints.slice(0, Math.ceil(slide.keyPoints.length / 2)).filter(Boolean).map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-red-600">Considerations</h4>
                <ul className="space-y-2">
                  {slide.keyPoints.slice(Math.ceil(slide.keyPoints.length / 2)).filter(Boolean).map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {slide.visualType === 'diagram' && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6">
              <div className="flex items-center justify-center space-x-4">
                {slide.keyPoints.filter(Boolean).map((point, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium">
                      {point}
                    </div>
                    {idx < slide.keyPoints.filter(Boolean).length - 1 && (
                      <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.visualType === 'chart' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {slide.keyPoints.filter(Boolean).map((point, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{idx + 1}</div>
                  <div className="text-sm">{point}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            data-testid="button-prev-slide"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="text-center text-sm text-gray-500">
            Part of: <span className="font-medium">{slideshowData.title}</span>
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentSlide(Math.min(slideshowData.slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slideshowData.slides.length - 1}
            data-testid="button-next-slide"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Interactive Slideshow Generator</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Create engaging, interactive slideshows for crypto education
        </p>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="slides">Slides ({slideshowData.slides.length})</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Slideshow Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={slideshowData.title}
                    onChange={(e) => setSlideshowData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter slideshow title"
                    data-testid="input-slideshow-title"
                  />
                </div>

                <div>
                  <Label htmlFor="estimatedDuration">Duration (minutes)</Label>
                  <Input
                    id="estimatedDuration"
                    type="number"
                    value={slideshowData.estimatedDuration}
                    onChange={(e) => setSlideshowData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 10 }))}
                    min="1"
                    max="120"
                    data-testid="input-duration"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={slideshowData.description}
                  onChange={(e) => setSlideshowData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this slideshow covers"
                  rows={3}
                  data-testid="textarea-description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={slideshowData.category}
                    onValueChange={(value) => setSlideshowData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger data-testid="select-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Difficulty</Label>
                  <Select
                    value={slideshowData.difficulty}
                    onValueChange={(value) => setSlideshowData(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger data-testid="select-difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map(difficulty => (
                        <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Required Tier</Label>
                  <Select
                    value={slideshowData.requiredTier}
                    onValueChange={(value) => setSlideshowData(prev => ({ ...prev, requiredTier: value }))}
                  >
                    <SelectTrigger data-testid="select-tier">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tiers.map(tier => (
                        <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    data-testid="input-new-tag"
                  />
                  <Button onClick={addTag} data-testid="button-add-tag">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {slideshowData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={slideshowData.isPublic}
                    onChange={(e) => setSlideshowData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    data-testid="checkbox-public"
                  />
                  <span>Make Public</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={slideshowData.isPremium}
                    onChange={(e) => setSlideshowData(prev => ({ ...prev, isPremium: e.target.checked }))}
                    data-testid="checkbox-premium"
                  />
                  <span>Premium Content</span>
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={generateFromAI} variant="outline" data-testid="button-generate-ai">
              <Upload className="h-4 w-4 mr-2" />
              Generate with AI
            </Button>
            <Button onClick={handleSave} disabled={createSlideshowMutation.isPending} data-testid="button-save-slideshow">
              <Save className="h-4 w-4 mr-2" />
              {createSlideshowMutation.isPending ? 'Saving...' : 'Save Slideshow'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="slides" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Slides</h2>
            <Button onClick={addSlide} data-testid="button-add-slide">
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </div>

          {slideshowData.slides.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">No slides yet. Click "Add Slide" to get started!</p>
                <Button onClick={addSlide} data-testid="button-first-slide">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Slide
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {slideshowData.slides.map((slide, index) => renderSlideEditor(slide, index))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {slideshowData.slides.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">Add some slides to see the preview!</p>
              </CardContent>
            </Card>
          ) : (
            renderSlidePreview(slideshowData.slides[currentSlide])
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}