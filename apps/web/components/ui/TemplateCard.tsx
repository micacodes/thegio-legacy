import { useState } from 'react';
import Image from 'next/image';
import { Template } from '@/lib/types';
import Button from './Button';

interface TemplateCardProps {
  template: Template;
  onSelect: (templateId: string) => Promise<void>;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleClick = async () => {
    setIsCreating(true);
    await onSelect(template.id);
    // The parent page will handle redirection, so we don't need to reset isCreating
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
      <div className="relative w-full h-52">
        <Image
          src={template.previewImgUrl}
          alt={template.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6 flex flex-col">
        <h3 className="text-xl font-bold text-brand-dark">{template.name}</h3>
        <p className="mt-2 text-gray-500 text-sm flex-grow h-12">{template.description}</p>
        <div className="mt-6">
          <Button
            variant="primary"
            className="w-full"
            onClick={handleClick}
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Use Template'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;