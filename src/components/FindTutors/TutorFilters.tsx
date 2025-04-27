
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TutorFilters = () => {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Institution" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="du">Dhaka University</SelectItem>
          <SelectItem value="buet">BUET</SelectItem>
          <SelectItem value="ju">Jahangirnagar University</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dhaka">Dhaka</SelectItem>
          <SelectItem value="chittagong">Chittagong</SelectItem>
          <SelectItem value="sylhet">Sylhet</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="math">Mathematics</SelectItem>
          <SelectItem value="physics">Physics</SelectItem>
          <SelectItem value="chemistry">Chemistry</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Online" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="offline">Offline</SelectItem>
          <SelectItem value="both">Both</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Amount" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0-1000">৳0 - ৳1000</SelectItem>
          <SelectItem value="1000-2000">৳1000 - ৳2000</SelectItem>
          <SelectItem value="2000+">৳2000+</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="4+">4+ Stars</SelectItem>
          <SelectItem value="3+">3+ Stars</SelectItem>
          <SelectItem value="2+">2+ Stars</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TutorFilters;
