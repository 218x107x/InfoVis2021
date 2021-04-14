class Vec3
{	
	constructor(x, y, z)
	{
		this.x = x;
		this.y = y;
		this.z = z;
	}

	add(v)
	{
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}

	min()
	{
		var min = this.x;
		if(this.y < min)
		{
			min = this.y;
		}
		if(this.z < min) {
			min = this.z;
		}
		return min;
	}

	mid()
	{
		var max = this.max();
		var min = this.min();
		var mid = this.x;
		if(this.y != max && this.y != min)
		{
			mid = this.y;
		}
		if(this.z == max && this.z == min)
		{
			mid = this.z;
		}
		return mid;
		
	}

	max()
	{
		var max = this.x;
		if(this.y > max)
		{
			max = this.y;
		}
		if(this.z > max) 
		{
			max = this.z;
		}
		return max;
	}

}
