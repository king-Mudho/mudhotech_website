"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { softwareServices, devServices } from "@/data/services";

export function ServiceTabs() {
  return (
    <Tabs defaultValue="software" className="max-w-6xl mx-auto">
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-10">
        <TabsTrigger value="software">Software Services</TabsTrigger>
        <TabsTrigger value="development">Development</TabsTrigger>
      </TabsList>

      <TabsContent value="software">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {softwareServices.map((service) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              items={service.items}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="development">
        <div className="grid md:grid-cols-2 gap-6">
          {devServices.map((service) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              items={service.items}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
